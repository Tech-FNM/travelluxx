import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface HomepageFaqProps {
  faqs?: FaqItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
  isRenax?: boolean;
}

const defaultHomepageFaqs: FaqItem[] = [
  {
    question: "How do I book an executive transfer with TravelLuxx?",
    answer: "You can book easily online using our instant Fare Calculator above, select your desired vehicle class (Economy, Luxury, or Family MPV), specify your pickup time and date, and complete your reservation with instant confirmation."
  },
  {
    question: "Do you provide flight monitoring for airport pickups?",
    answer: "Yes, our team actively monitors all inbound commercial flights in real-time. Whether your flight is delayed or lands early, your chauffeur will adjust their schedule accordingly and meet you inside the terminal with a name board."
  },
  {
    question: "What vehicle classes are available?",
    answer: "We offer Mercedes-Benz E-Class & S-Class executive sedans for up to 4 passengers, and Mercedes V-Class / luxury multi-passenger vehicles (MPVs) for families and business groups carrying up to 7-8 passengers and substantial luggage."
  },
  {
    question: "Can I apply a promo code or discount voucher?",
    answer: "Yes! At Step 3 (Secure Checkout) in our Booking Calculator, you can enter your promo code in the discount field and click 'Apply' to instantly receive your calculated savings before confirming your reservation."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, Apple Pay, Google Pay, and Klarna through our secure Mollie payments integration, as well as pre-authorized Cash on Departure / Pay Later options."
  }
];

export default function HomepageFaq({
  faqs,
  title,
  subtitle,
  badge = "FAQ & Information",
  isRenax = false
}: HomepageFaqProps) {
  const displayFaqs = (Array.isArray(faqs) && faqs.length > 0) ? faqs.filter(f => f.question && f.answer) : defaultHomepageFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!displayFaqs || displayFaqs.length === 0) return null;

  return (
    <section
      className={`tl-section ${
        isRenax
          ? "bg-brand-950 border-t border-white/10 text-stone-300"
          : "bg-ivory text-stone-700 [#airports+&]:border-t [#airports+&]:border-stone-200"
      }`}
    >
      <div className="tl-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Section header: left column, stays in view while the list scrolls on desktop */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            {/* Reveal attributes sit on the elements inside the sticky column, never on the sticky wrapper */}
            <span data-reveal className={`tl-eyebrow empty:hidden ${isRenax ? "tl-eyebrow-light" : ""}`}>{badge}</span>
            <h2 data-reveal="lines" className={`tl-h2 mt-4 ${isRenax ? "text-white" : ""}`}>
              {title || "Frequently Asked Questions"}
            </h2>
            <p data-reveal data-reveal-delay="0.1" className={`tl-lead mt-5 max-w-md ${isRenax ? "text-stone-300" : ""}`}>
              {subtitle || "Everything you need to know about our chauffeur services, airport transfers, vehicle fleet, and booking process."}
            </p>
          </div>

          {/* Accordion: right column. Whole items stagger in; nothing inside an item is revealed on its own. */}
          <div data-reveal-group className={`divide-y border-y lg:col-span-7 ${isRenax ? "divide-white/10 border-white/10" : "divide-stone-200 border-stone-200"}`}>
            {displayFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const questionId = `homepage-faq-q-${index}`;
              const answerId = `homepage-faq-a-${index}`;
              return (
                <div key={faq.question || index}>
                  {/* The question is a plain <h3> (text only). The toggle lives on the row + sibling button. */}
                  <div
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="group flex items-start justify-between gap-6 py-6 cursor-pointer"
                  >
                    <h3
                      id={questionId}
                      className={`text-base leading-snug font-medium transition-colors duration-200 sm:text-lg ${
                        isRenax
                          ? "text-white group-hover:text-brand-300"
                          : "text-stone-900 group-hover:text-brand-800"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      aria-labelledby={questionId}
                      className={`-my-2.5 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200 ${
                        isRenax
                          ? "text-stone-400 group-hover:text-white"
                          : "text-stone-500 group-hover:text-stone-900"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-5 w-5" strokeWidth={1.5} />
                      ) : (
                        <Plus className="h-5 w-5" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className={`pb-6 pr-10 text-base leading-relaxed ${
                      isRenax ? "text-stone-300" : "text-stone-600"
                    } ${isOpen ? "block" : "hidden"}`}
                  >
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

