import React from "react";
import { getAirports } from "./airports";
import { useContent } from "../../content/useContent";

interface ServiceStatementProps {
  settings?: any;
}

/**
 * What the service is, in one large paragraph whose words light up as it scrolls past
 * (data-reveal="words"), followed by three figures. Every figure is a real count.
 */
export default function ServiceStatement({ settings }: ServiceStatementProps) {
  const c = useContent(settings);
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const airports = getAirports(settings);

  // Placeholders the owner can use in any text of this section.
  const fill = (value: string) =>
    value
      .replace(/\{brand\}/g, brandName)
      .replace(/\{airport_count\}/g, String(airports.length))
      .replace(/\{airport_codes\}/g, airports.map((airport) => airport.code).join(" · "));

  if (!c.on("home_statement_enabled")) return null;

  // data-reveal="words" splits a single run of text, so the paragraph is kept on one line.
  const statement = fill(c.t("home_statement_text")).replace(/\s+/g, " ").trim();

  const facts = [1, 2, 3].map((n) => ({
    figure: fill(c.t(`home_statement_fig${n}_value`)),
    title: fill(c.t(`home_statement_fig${n}_title`)),
    text: fill(c.t(`home_statement_fig${n}_text`)),
  }));

  return (
    <section className="tl-section bg-white">
      <div className="tl-container">
        {/* Two rows on one grid: a narrow label column and a wide content column. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            <span data-reveal className="tl-eyebrow">{fill(c.t("home_statement_label"))}</span>
          </div>
          <div className="lg:col-span-9">
            <p data-reveal="words" className="tl-statement text-pretty">
              {statement}
            </p>
          </div>
        </div>

        <div data-reveal="rule" className="mt-14 h-px w-full bg-stone-300 lg:mt-24"></div>

        <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-12 lg:gap-16 lg:pt-10">
          <div className="lg:col-span-3">
            <span data-reveal className="block text-xs font-medium uppercase tracking-[0.22em] text-stone-500">{fill(c.t("home_statement_figures_label"))}</span>
          </div>
          <ul data-reveal-group className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3 lg:col-span-9">
            {facts.map((fact, index) => (
              <li key={index}className="flex items-start gap-6 sm:flex-col sm:gap-5">
                <span data-count className="tl-numeral w-28 shrink-0 sm:w-auto lg:text-7xl!">
                  {fact.figure}
                </span>
                <span className="block pt-1 sm:pt-0">
                  <span className="block text-base font-semibold text-stone-900">{fact.title}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-stone-600">{fact.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
