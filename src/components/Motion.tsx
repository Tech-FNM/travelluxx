import { useEffect } from "react";

/**
 * Site-wide scroll animation, driven by GSAP ScrollTrigger.
 *
 * Components do not import gsap. They only mark elements with data attributes and this
 * engine (mounted once in pages/_app.tsx) animates each of them once, when it scrolls into view:
 *
 *   data-reveal                 fade in and rise
 *   data-reveal="lines"         headings: revealed line by line from behind a mask
 *   data-reveal="image"         photo wrapper wipes open while the image settles from a zoom
 *   data-reveal="fade"          opacity only
 *   data-reveal="words"         a statement paragraph whose words light up as it scrolls past
 *   data-reveal="rule"          a hairline that draws itself from left to right
 *   data-reveal-group           direct children reveal one after another
 *   data-reveal-delay="0.2"     delay in seconds
 *   data-parallax               image drifts slower than the page scroll
 *   data-count                  a number that counts up from zero ("120", "4.9", "£45")
 *   data-hscroll                desktop only: the section pins and its [data-hscroll-track]
 *                               child travels sideways as the page scrolls
 *
 * Elements are pre-hidden by CSS only under html.motion, a class that an inline script in
 * pages/_document.tsx adds when JavaScript runs and the visitor has not asked for reduced motion.
 * If this engine cannot start, the class is removed and everything is simply visible.
 */

const READY = "data-reveal-ready";
const PENDING = `[data-reveal]:not([${READY}]), [data-reveal-group]:not([${READY}]), [data-parallax]:not([${READY}]), [data-count]:not([${READY}]), [data-hscroll]:not([${READY}])`;
// clamp(): an element near the end of the page can never scroll up to the 88% line on a tall
// screen, so the trigger point is capped at the furthest the page can actually scroll.
const START = "clamp(top 88%)";
const RESET = "opacity,visibility,transform";

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return;

    let disposed = false;
    let teardown = () => {};
    const showEverything = () => root.classList.remove("motion");
    // Never leave content hidden waiting for a script that is slow or blocked.
    const failSafe = window.setTimeout(showEverything, 4000);

    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/SplitText"),
        ]);
        // Line splitting needs the final fonts, or the line breaks are measured wrong.
        await Promise.race([
          document.fonts?.ready ?? Promise.resolve(),
          new Promise((resolve) => window.setTimeout(resolve, 1500)),
        ]);
        // If the fail-safe already showed the page, leave it alone rather than hide it again.
        if (disposed || !root.classList.contains("motion")) return;
        window.clearTimeout(failSafe);
        gsap.registerPlugin(ScrollTrigger, SplitText);
        teardown = start(gsap, ScrollTrigger, SplitText);
      } catch (err) {
        console.warn("Scroll animation disabled:", err);
        showEverything();
      }
    })();

    return () => {
      disposed = true;
      window.clearTimeout(failSafe);
      teardown();
    };
  }, []);

  return null;
}

function start(gsap: any, ScrollTrigger: any, SplitText: any) {
  // Reveals that have been set up but have not played yet.
  const waiting = new Set<() => void>();

  // Plays `run` once, the first time `trigger` is on screen. Three things can start it, and
  // whichever comes first wins:
  //  1. it is already on screen when it is set up (everything above the fold on page load:
  //     a scroll trigger alone never fires for those, because nothing has scrolled yet);
  //  2. the scroll trigger, as the visitor scrolls down to it;
  //  3. an IntersectionObserver, as a safety net if the page layout shifted under the trigger.
  // Reaching the end of the page plays whatever is still waiting (see `onScrollEnd` below).
  const onEnter = (trigger: Element, run: () => void) => {
    let played = false;
    let scrollTrigger: any = null;
    let observer: IntersectionObserver | null = null;
    const play = () => {
      if (played) return;
      played = true;
      waiting.delete(play);
      if (scrollTrigger) scrollTrigger.kill();
      if (observer) observer.disconnect();
      run();
    };

    if (trigger.getBoundingClientRect().top < window.innerHeight * 0.88) {
      play();
      return;
    }

    waiting.add(play);
    scrollTrigger = ScrollTrigger.create({ trigger, start: START, once: true, onEnter: play });
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) play();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(trigger);
  };

  const setup = (el: HTMLElement) => {
    const delay = Number(el.dataset.revealDelay) || 0;

    if (el.hasAttribute("data-parallax")) {
      const strength = Number(el.dataset.parallax) || 8;
      // Oversize the image by the distance it travels so its edges never show.
      gsap.set(el, { scale: 1 + (strength * 2) / 100 + 0.02 });
      gsap.fromTo(
        el,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }

    if (el.hasAttribute("data-count")) {
      // "£1,250", "4.9", "120+" -> counts up to the number, keeping whatever surrounds it.
      const match = (el.textContent || "").match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/s);
      if (match) {
        const [, prefix, raw, suffix] = match;
        const target = Number(raw.replace(/,/g, ""));
        const decimals = (raw.split(".")[1] || "").length;
        const grouped = raw.includes(",");
        const format = (n: number) =>
          prefix + (grouped ? n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toFixed(decimals)) + suffix;
        const state = { value: 0 };
        el.textContent = format(0);
        onEnter(el, () =>
          gsap.to(state, { value: target, duration: 1.6, ease: "power2.out", delay, onUpdate: () => { el.textContent = format(state.value); } })
        );
      }
    }

    if (el.hasAttribute("data-hscroll")) {
      const track = el.querySelector<HTMLElement>("[data-hscroll-track]");
      el.setAttribute(READY, "");
      if (track) {
        // Desktop only. On touch screens the track simply scrolls sideways under the finger.
        gsap.matchMedia().add("(min-width: 1024px)", () => {
          const distance = () => Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "center center",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      }
      return;
    }

    if (el.hasAttribute("data-reveal-group")) {
      const items = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
      const each = Number(el.dataset.revealGroup) || (items.length > 8 ? 0.06 : 0.1);
      gsap.set(items, { autoAlpha: 0, y: 32 });
      el.setAttribute(READY, "");
      onEnter(el, () =>
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: each, delay, clearProps: RESET })
      );
      return;
    }

    if (!el.hasAttribute("data-reveal")) {
      el.setAttribute(READY, "");
      return;
    }

    const kind = el.dataset.reveal || "up";

    if (kind === "words") {
      el.setAttribute(READY, "");
      let split: any = null;
      try {
        split = SplitText.create(el, { type: "words" });
      } catch {
        split = null;
      }
      if (!split || !split.words || split.words.length === 0) {
        gsap.set(el, { clearProps: RESET });
        return;
      }
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        { opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 52%", scrub: 0.4 } }
      );
      return;
    }

    if (kind === "rule") {
      gsap.set(el, { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" });
      el.setAttribute(READY, "");
      onEnter(el, () => gsap.to(el, { scaleX: 1, duration: 1.2, ease: "power3.inOut", delay, clearProps: RESET }));
      return;
    }

    if (kind === "lines") {
      gsap.set(el, { autoAlpha: 0 });
      el.setAttribute(READY, "");
      onEnter(el, () => {
        let split: any = null;
        try {
          split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "tl-line" });
        } catch {
          split = null;
        }
        if (!split || !split.lines || split.lines.length === 0) {
          gsap.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", delay, clearProps: RESET });
          return;
        }
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.1,
          delay,
          // Put the heading back exactly as it was rendered: plain text, no wrapper elements.
          onComplete: () => {
            split.revert();
            gsap.set(el, { clearProps: "opacity,visibility" });
          },
        });
      });
      return;
    }

    if (kind === "image") {
      const images = el.querySelectorAll("img");
      gsap.set(el, { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(images, { scale: 1.2 });
      el.setAttribute(READY, "");
      onEnter(el, () => {
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut", delay, clearProps: "clipPath,opacity,visibility" });
        gsap.to(images, { scale: 1, duration: 1.7, ease: "power3.out", delay, clearProps: "transform" });
      });
      return;
    }

    const from = kind === "fade" ? { autoAlpha: 0 } : { autoAlpha: 0, y: 28 };
    const to = kind === "fade" ? { autoAlpha: 1 } : { autoAlpha: 1, y: 0 };
    gsap.set(el, from);
    el.setAttribute(READY, "");
    onEnter(el, () => gsap.to(el, { ...to, duration: kind === "fade" ? 1.1 : 0.9, ease: "power3.out", delay, clearProps: RESET }));
  };

  const scan = () => {
    if (window.location.pathname.startsWith("/admin")) return;
    document.querySelectorAll<HTMLElement>(PENDING).forEach((el) => {
      try {
        setup(el);
      } catch {
        // Whatever went wrong, never leave this element hidden.
        el.setAttribute(READY, "");
        gsap.set(el, { clearProps: `${RESET},clipPath` });
        gsap.set(el.children, { clearProps: RESET });
      }
    });
  };

  // New elements appear after client-side navigation and when components re-render.
  let scanQueued = false;
  const queueScan = () => {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(() => {
      scanQueued = false;
      scan();
    });
  };
  const mutations = new MutationObserver(queueScan);
  mutations.observe(document.body, { childList: true, subtree: true });

  // Nothing may stay hidden at the very end of the page (tall screens, short pages).
  const onScrollEnd = () => {
    if (waiting.size === 0) return;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      Array.from(waiting).forEach((play) => play());
    }
  };
  window.addEventListener("scroll", onScrollEnd, { passive: true });

  // Page height changes (images loading, accordions, booking steps) move every trigger point.
  let refreshTimer = 0;
  const resize = new ResizeObserver(() => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      ScrollTrigger.getAll().forEach((t: any) => {
        if (t.trigger && !t.trigger.isConnected) t.kill();
      });
      ScrollTrigger.refresh();
    }, 200);
  });
  resize.observe(document.body);

  scan();

  return () => {
    window.removeEventListener("scroll", onScrollEnd);
    mutations.disconnect();
    resize.disconnect();
    window.clearTimeout(refreshTimer);
    ScrollTrigger.getAll().forEach((t: any) => t.kill());
  };
}
