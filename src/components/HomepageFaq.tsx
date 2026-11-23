import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

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
    <section className={`py-20 sm:py-24 transition-colors ${isRenax ? "bg-[#0a0b0e] border-t border-slate-900/80 text-white" : "bg-slate-50 border-t border-slate-200/80 text-slate-900"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{badge}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isRenax ? "text-white" : "text-slate-900"}`}>
            {title || "Frequently Asked Questions"}
          </h2>
          <p className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto ${isRenax ? "text-slate-400" : "text-slate-600"}`}>
            {subtitle || "Everything you need to know about our chauffeur services, airport transfers, vehicle fleet, and booking process."}
          </p>
        </div>

        <div className="space-y-3.5">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const questionId = `homepage-faq-q-${index}`;
            const answerId = `homepage-faq-a-${index}`;
            return (
              <div
                key={faq.question || index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isRenax
                    ? isOpen
                      ? "border-emerald-500/50 bg-[#12141c] shadow-lg shadow-emerald-500/5"
                      : "border-slate-800/80 bg-[#0d0e14] hover:border-slate-700"
                    : isOpen
                    ? "border-emerald-300 bg-white shadow-md shadow-emerald-600/5 ring-1 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                }`}
              >
                <h3
                  id={questionId}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenIndex(isOpen ? null : index);
                    }
                  }}
                  className={`cursor-pointer w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left font-semibold text-base sm:text-lg leading-snug transition select-none ${
                    isRenax
                      ? isOpen
                        ? "text-emerald-400"
                        : "text-white hover:text-slate-200"
                      : isOpen
                      ? "text-emerald-800"
                      : "text-slate-900 hover:text-slate-700"
                  }`}
                >
                  {faq.question}
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-emerald-500 text-slate-950 rotate-180 shadow-sm"
                        : isRenax
                        ? "bg-slate-800/80 text-slate-400 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={`px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed border-t transition-all ${
                    isRenax ? "border-slate-800/60 text-slate-300" : "border-slate-100 text-slate-600"
                  } ${isOpen ? "block" : "hidden"}`}
                >
                  <p className="whitespace-pre-line">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

