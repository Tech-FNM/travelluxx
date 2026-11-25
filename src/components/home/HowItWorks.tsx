import React from "react";
import { ArrowRight } from "lucide-react";

interface HowItWorksProps {
  onScrollToCalculator: () => void;
}

const STEPS = [
  {
    title: "Get a fixed quote",
    text: "Enter your pickup and destination to see a fixed fare for each vehicle class. No surge pricing.",
  },
  {
    title: "Tell us your journey details",
    text: "Add your date, time, passengers and luggage, and your flight number if we are meeting you at an airport.",
  },
  {
    title: "Pay online or pay your driver",
    text: "Pay securely online when you book, or choose pay later and settle with your chauffeur on the day.",
  },
  {
    title: "Your chauffeur arrives",
    text: "A licensed chauffeur meets you on time. On airport pickups we monitor your flight and adjust if it lands early or late.",
  },
];

/** The booking process as a numbered editorial row: four columns divided by hairlines. */
export default function HowItWorks({ onScrollToCalculator }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="tl-section bg-ivory">
      <div className="tl-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <span data-reveal className="tl-eyebrow">How it works</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4 max-w-2xl text-balance">
              From fixed quote to your door, in four steps
            </h2>
          </div>
          <div data-reveal data-reveal-delay="0.1" className="shrink-0">
            <button type="button" onClick={onScrollToCalculator} className="tl-btn tl-btn-outline">
              <span>Start with a quote</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div data-reveal="rule" className="mt-12 h-px w-full bg-stone-300 lg:mt-16"></div>

        <ol data-reveal-group className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-stone-300 py-8 sm:flex sm:flex-col sm:px-8 sm:py-10 lg:border-b-0 lg:px-8 lg:pt-10 lg:pb-2 ${
                index % 2 === 0 ? "sm:pl-0" : "sm:border-l"
              } ${index === 0 ? "lg:pl-0" : "lg:border-l lg:pl-8"} ${index === STEPS.length - 1 ? "lg:pr-0" : ""}`}
            >
              <span className="tl-numeral lg:text-7xl!" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pt-1.5 sm:pt-0">
                <h3 className="tl-h3 sm:mt-8 lg:mt-24">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-stone-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
