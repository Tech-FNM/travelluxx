import React, { useState } from "react";
import { formatUkPhone, phoneHref } from "../utils/phone";
import { Send, CheckCircle } from "lucide-react";
import { trackClick } from "../utils/analytics";
import { useContent } from "../content/useContent";

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
  const c = useContent(settings);

  const officeAddress = settings?.office_address || settings?.officeAddress || "Shirley B90 Shirley, Solihull, West Midlands, UK";
  const businessEmail = settings?.business_email || settings?.businessEmail || "info@travelluxx.co.uk";
  const whatsappNum = settings?.whatsapp_number || "441217140876";

  const formattedPhone = formatUkPhone(whatsappNum);

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
        alert(c.t("contact_error_text"));
      }
    } catch (err) {
      alert(c.t("contact_error_connection_text"));
    } finally {
      setLoading(false);
    }
  };

  if (!c.on("contact_enabled")) return null;

  return (
    <section id="contact" className="tl-section bg-ivory">
      <div className="tl-container">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left Block: Contact coordinates */}
          <div className="lg:col-span-5">
            <span data-reveal className="tl-eyebrow">{c.t("contact_eyebrow")}</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4">
              {c.t("contact_heading")}
            </h2>
            <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5">
              {c.t("contact_intro")}
            </p>

            <dl data-reveal-group className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.t("contact_address_label")}</dt>
                <dd className="mt-2 text-base text-stone-900">
                  {officeAddress}
                </dd>
              </div>

              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.t("contact_email_label")}</dt>
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
                <dt className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.t("contact_phone_label")}</dt>
                <dd className="mt-2 font-display text-3xl leading-tight font-medium text-stone-900 lining-nums sm:text-4xl">
                  <a
                    href={phoneHref(whatsappNum)}
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
                <h3 className="tl-h3 mt-6">{c.t("contact_success_heading")}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-stone-600">
                  {c.t("contact_success_text")}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="tl-btn tl-btn-outline mt-8"
                >
                  {c.t("contact_success_button")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="tl-h3">
                  <span>{c.t("contact_form_heading")}</span>
                </h3>

                <div>
                  <label htmlFor="contact-form-name" className="tl-label">{c.t("contact_name_label")}</label>
                  <input
                    id="contact-form-name"
                    type="text"
                    placeholder={c.t("contact_name_placeholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="tl-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-form-email" className="tl-label">{c.t("contact_email_field_label")}</label>
                    <input
                      id="contact-form-email"
                      type="email"
                      placeholder={c.t("contact_email_placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="tl-input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-form-phone" className="tl-label">{c.t("contact_phone_field_label")}</label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      placeholder={c.t("contact_phone_placeholder")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="tl-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-form-message" className="tl-label">{c.t("contact_message_label")}</label>
                  <textarea
                    id="contact-form-message"
                    rows={4}
                    placeholder={c.t("contact_message_placeholder")}
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
                      <span>{c.t("contact_sending_text")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={1.5} />
                      <span>{c.t("contact_submit_text")}</span>
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
