import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { travelluxxLogoBase64 } from "../assets/travelluxx_logo_datauri";
import { settingImage } from "../utils/customImages";
import { formatUkPhone, phoneHref } from "../utils/phone";
import { SiteLink } from "../utils/siteLink";
import { useSettings } from "../context/SettingsContext";
import { useContent } from "../content/useContent";

interface NavbarProps {
  // Kept for the existing callers; anchor links now handle themselves (see SiteLink).
  onScrollTo?: (elementId: string) => void;
  onAdminClick?: () => void;
}

export default function Navbar(_props: NavbarProps) {
  const { settings, menuItems } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const c = useContent();
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<{ [id: string]: boolean }>({});

  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";

  // Logo: the dashboard setting (Site Content / Settings → General → Site Logo), else the built-in logo.
  const logoSetting = settings?.logo_url || settings?.logo_image || settings?.logoImage;
  const [logoFailed, setLogoFailed] = useState(false);
  useEffect(() => setLogoFailed(false), [logoSetting]);
  const brandLogo = logoFailed ? travelluxxLogoBase64 : settingImage(logoSetting, travelluxxLogoBase64);

  const isRenax = settings?.active_theme === "renax";

  // Phone number, written the UK way (+44 121 714 0876) unless the admin typed their own text
  const whatsappNum = String(settings?.whatsapp_number || "441217140876");
  const formattedPhone = c.t("nav_phone_display") || formatUkPhone(whatsappNum);
  const phoneLink = c.t("nav_phone_link") || phoneHref(whatsappNum);
  const quoteText = c.t("nav_quote_text");
  const quoteHref = c.t("nav_quote_link");

  // The menu comes from the Menus tab via SettingsContext (which has its own default menu).
  const activeNavItems: any[] = Array.isArray(menuItems) ? menuItems : [];

  // Shared class strings (light bar / renax dark bar)
  const barTone = isRenax
    ? "bg-brand-950 border-white/10 text-stone-200"
    : "bg-white border-stone-200 text-stone-700";
  const hairline = isRenax ? "border-white/10" : "border-stone-200";

  // Desktop
  const deskLink = `inline-flex items-center gap-1.5 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 ${isRenax ? "text-stone-200 hover:text-brand-300" : "text-stone-700 hover:text-brand-700"
    }`;
  const deskParentLink = `inline-flex items-center gap-1.5 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 ${isRenax ? "text-stone-200 group-hover/dropdown:text-brand-300" : "text-stone-700 group-hover/dropdown:text-brand-700"
    }`;
  const deskChildLink = `block w-full px-5 py-2.5 text-left text-sm cursor-pointer transition-colors duration-200 ${isRenax
      ? "text-stone-200 hover:bg-white/5 hover:text-brand-300"
      : "text-stone-700 hover:bg-stone-50 hover:text-brand-700"
    }`;

  // Mobile
  const mobLink = `flex min-h-12 items-center py-2 text-left text-base font-medium cursor-pointer transition-colors duration-200 ${isRenax ? "text-stone-200 hover:text-brand-300" : "text-stone-900 hover:text-brand-700"
    }`;
  const mobChildLink = `flex min-h-12 w-full items-center py-2 text-left text-sm cursor-pointer transition-colors duration-200 ${isRenax ? "text-stone-300 hover:text-brand-300" : "text-stone-600 hover:text-brand-700"
    }`;

  // Logo goes to the homepage; on the homepage itself it scrolls back to the top.
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`sticky top-0 z-50 border-b ${barTone}`}>
      {/* Main Navbar */}
      <div className="tl-container">
        <div className="flex h-[72px] items-center justify-between gap-6 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">

          {/* Logo Section */}
          <div className="flex items-center">
            <SiteLink href="/" onClick={handleLogoClick} className="flex shrink-0 cursor-pointer items-center justify-center">
              <img
                src={brandLogo || travelluxxLogoBase64}
                alt={c.t("nav_logo_alt") || `${brandName} Logo`}
                width={260}
                height={80}
                decoding="async"
                className="h-11 w-auto max-w-[180px] object-contain lg:h-12 lg:max-w-[200px]"
                onError={() => {
                  if (brandLogo !== travelluxxLogoBase64) setLogoFailed(true);
                }}
              />
            </SiteLink>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main" className="hidden h-full items-center gap-9 lg:flex">
            {activeNavItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;

              if (hasChildren) {
                return (
                  <div key={item.id} className="group/dropdown relative flex h-full items-center">
                    <SiteLink href={item.href} target={item.target} className={deskParentLink}>
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4 opacity-60" strokeWidth={1.5} aria-hidden="true" />
                    </SiteLink>

                    {/* Dropdown panel: hangs from the bar's hairline; opens on hover and on keyboard focus */}
                    <div className="invisible absolute top-full -left-5 z-50 group-hover/dropdown:visible group-has-[:focus-visible]/dropdown:visible">
                      <div className={`max-h-[calc(100vh-7rem)] w-max max-w-[340px] min-w-[240px] overflow-y-auto rounded-sm border py-2 shadow-sm ${isRenax
                          ? "bg-brand-950 border-white/10"
                          : "bg-white border-stone-200"
                        }`}>
                        {item.children.map((child: any) => (
                          <SiteLink key={child.id} href={child.href} target={child.target} className={deskChildLink}>
                            {child.label}
                          </SiteLink>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <SiteLink key={item.id} href={item.href} target={item.target} className={deskLink}>
                  {item.label}
                </SiteLink>
              );
            })}
          </nav>

          {/* Desktop contact: phone + quote */}
          <div className="hidden items-center justify-end gap-7 lg:flex">
            <a
              href={phoneLink}
              className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${isRenax ? "text-stone-200 hover:text-brand-300" : "text-stone-900 hover:text-brand-700"
                }`}
            >
              {formattedPhone}
            </a>
            <SiteLink
              href={quoteHref}
              className={`tl-btn h-11 px-5 ${isRenax ? "tl-btn-light" : "tl-btn-primary"}`}
            >
              {quoteText}
            </SiteLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className={`-mr-3 inline-flex h-12 w-12 cursor-pointer items-center justify-center transition-colors duration-200 ${isRenax ? "text-white hover:text-brand-300" : "text-stone-900 hover:text-brand-700"
                }`}
            >
              {isOpen ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="site-mobile-menu"
          className={`absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-b shadow-sm lg:hidden ${barTone}`}
        >
          <div className="tl-container pb-6">
            <nav aria-label="Mobile" className={`flex flex-col divide-y border-b ${isRenax ? "divide-white/10" : "divide-stone-200"} ${hairline}`}>
              {activeNavItems.map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const isSubOpen = !!openMobileDropdowns[item.id];

                if (hasChildren) {
                  return (
                    <div key={item.id}>
                      <div className="flex items-center justify-between gap-2">
                        <SiteLink href={item.href} target={item.target} onClick={closeMenu} className={`${mobLink} flex-1`}>
                          {item.label}
                        </SiteLink>
                        <button
                          type="button"
                          onClick={() => setOpenMobileDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          aria-label={`${isSubOpen ? "Hide" : "Show"} ${item.label} links`}
                          aria-expanded={isSubOpen}
                          className={`-mr-3 inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200 ${isRenax ? "text-stone-400 hover:text-brand-300" : "text-stone-500 hover:text-brand-700"
                            }`}
                        >
                          <ChevronDown className={`h-5 w-5 ${isSubOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
                        </button>
                      </div>

                      {isSubOpen && (
                        <div className={`mb-3 border-l pl-4 ${hairline}`}>
                          {item.children.map((child: any) => (
                            <SiteLink key={child.id} href={child.href} target={child.target} onClick={closeMenu} className={mobChildLink}>
                              {child.label}
                            </SiteLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <SiteLink key={item.id} href={item.href} target={item.target} onClick={closeMenu} className={mobLink}>
                    {item.label}
                  </SiteLink>
                );
              })}
            </nav>

            {/* Mobile contact: quote + phone */}
            <div className="flex flex-col gap-3 pt-6">
              <SiteLink
                href={quoteHref}
                onClick={closeMenu}
                className={`tl-btn w-full ${isRenax ? "tl-btn-light" : "tl-btn-primary"}`}
              >
                {quoteText}
              </SiteLink>
              <a
                href={phoneLink}
                className={`tl-btn w-full ${isRenax ? "tl-btn-outline-light" : "tl-btn-outline"}`}
              >
                {formattedPhone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
