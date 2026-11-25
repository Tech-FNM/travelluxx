import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { trackClick } from "../utils/analytics";

interface ContactFormProps {
  settings?: any;
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const officeAddress = settings?.office_address || settings?.officeAddress || "Shirley B90 Shirley, Solihull, West Midlands, UK";
  const businessEmail = settings?.business_email || settings?.businessEmail || "info@travelluxx.co.uk";
  const whatsappNum = settings?.whatsapp_number || "441217140876";

  const formattedPhone = whatsappNum.startsWith("44") 
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}` 
    : whatsappNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, type: "General Inquiry" })
      });

      if (res.ok) {
        trackClick("contact_submit");
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        alert("Submission failed. Please check inputs.");
      }
    } catch (err) {
      alert("Submission failed due to connection failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="tl-section bg-ivory">
      <div className="tl-container">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left Block: Contact coordinates */}
          <div className="lg:col-span-5">
            <span data-reveal className="tl-eyebrow">Get in Touch</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4">
              Connect With Our Dispatch Office
            </h2>
            <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5">
              Need a multi-day itinerary, corporate account or custom arrangement? For chauffeur hire Birmingham quotes, drop us a line or message us on WhatsApp. Our dispatch operators are active 24/7.
            </p>

            <dl data-reveal-group className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">Office Address</dt>
                <dd className="mt-2 text-base text-stone-900">
                  {officeAddress}
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">Email Dispatch</dt>
                <dd className="mt-2 text-base text-stone-900">
                  <a
                    href={`mailto:${businessEmail}`}
                    className="-my-2.5 inline-block py-2.5 break-all underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-brand-700 hover:decoration-brand-700"
                  >
                    {businessEmail}
                  </a>
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">WhatsApp & Telephone Hotline</dt>
                <dd className="mt-2 font-display text-3xl leading-tight font-medium text-stone-900 lining-nums sm:text-4xl">
                  <a
                    href={`tel:${whatsappNum}`}
                    className="-my-2 inline-block py-2 transition-colors duration-200 hover:text-brand-700"
                  >
                    {formattedPhone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Block: General Inquiry form. The reveal sits on this stable wrapper so that
              swapping the form for the success state does not replay it. */}
          <div data-reveal data-reveal-delay="0.1" className="tl-card p-6 sm:p-10 lg:col-span-7">

            {success ? (
              <div role="status">
                <CheckCircle className="h-8 w-8 text-brand-700" strokeWidth={1.5} />
                <h3 className="tl-h3 mt-6">Message Dispatched Successfully</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-stone-600">
                  We have received your general inquiry! A Travelluxx operator will email or text back under 15 minutes.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="tl-btn tl-btn-outline mt-8"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="tl-h3">
                  <span>Submit a Customised Inquiry</span>
                </h3>

                <div>
                  <label htmlFor="contact-form-name" className="tl-label">Full Name</label>
                  <input
                    id="contact-form-name"
                    type="text"
                    placeholder="e.g. Richard Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="tl-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-form-email" className="tl-label">Email Address</label>
                    <input
                      id="contact-form-email"
                      type="email"
                      placeholder="e.g. sterling@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="tl-input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-form-phone" className="tl-label">Phone (Optional)</label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      placeholder="e.g. 0121 714 0876"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="tl-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-form-message" className="tl-label">Message Description</label>
                  <textarea
                    id="contact-form-message"
                    rows={4}
                    placeholder="Tell us your dates, route and passenger details and we will confirm your private hire Birmingham booking quickly."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="tl-input min-h-40 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="tl-btn tl-btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={1.5} />
                      <span>Dispatch Inquiry Sheet</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
