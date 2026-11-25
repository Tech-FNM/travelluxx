import { Phone, Mail, MapPin, Instagram } from "lucide-react";

import { SiteLink } from "../utils/siteLink";
import { formatUkPhone, phoneHref as toPhoneHref } from "../utils/phone";
import { useSettings } from "../context/SettingsContext";
import { useContent } from "../content/useContent";

interface FooterProps {
  onScrollTo: (elementId: string) => void;
  onAdminClick?: () => void;
}

// Custom TikTok SVG Icon
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.25a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.58a8.27 8.27 0 0 0 4.91 1.6V6.69z" />
    </svg>
  );
}

// Custom Pinterest SVG Icon
function PinterestIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

const columnHeading = "text-xs font-medium uppercase tracking-[0.22em] text-stone-400";
const columnLink = "block py-3 text-sm leading-5 text-stone-300 transition-colors duration-200 hover:text-white lg:py-1.5";

// One link column ("Services", "Service areas") built from a menu item's children
function FooterLinkColumn({ title, links }: { title: string; links: any[] }) {
  return (
    <nav aria-label={title}>
      <p className={columnHeading}>{title}</p>
      <ul className="mt-3 lg:mt-4">
        {links.map((child: any, index: number) => (
          <li key={child.id || `${child.href}-${index}`}>
            <SiteLink href={child.href} target={child.target} className={columnLink}>
              {child.label}
            </SiteLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer({ onScrollTo, onAdminClick }: FooterProps) {
  const { settings, menuItems } = useSettings();
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";
  const emailAddr = settings?.business_email || "info@travelluxx.co.uk";
  const officeAddr = settings?.office_address || "Shirley B90 Shirley, Solihull, West Midlands, UK";

  const c = useContent();

  // Social media URLs
  const instagramUrl = c.t("social_instagram");
  const tiktokUrl = c.t("social_tiktok");
  const pinterestUrl = c.t("social_pinterest");
  const showInstagram = c.on("footer_social_instagram_enabled");
  const showTiktok = c.on("footer_social_tiktok_enabled");
  const showPinterest = c.on("footer_social_pinterest_enabled");
  const showSocial = showInstagram || showTiktok || showPinterest;

  const isRenax = settings?.active_theme === "renax";

  const formattedPhone = formatUkPhone(whatsappNum);
  const phoneHref = toPhoneHref(whatsappNum);

  // Link columns: children of the menu items that link to /services and /service-areas (Menus tab,
  // via SettingsContext). Matched by link first, so renaming the menu label does not empty the
  // column; then by the default item id, then by label.
  const activeNavItems: any[] = Array.isArray(menuItems) ? menuItems : [];
  const normPath = (href: unknown) =>
    typeof href === "string" ? href.trim().replace(/^https?:\/\/[^/]+/i, "").replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase() || "/" : "";
  const menuChildren = (href: string, id: string, labels: string[]): any[] => {
    const withChildren = activeNavItems.filter((entry: any) => Array.isArray(entry?.children) && entry.children.length > 0);
    const item =
      withChildren.find((entry: any) => normPath(entry.href) === href) ||
      withChildren.find((entry: any) => entry?.id === id) ||
      withChildren.find((entry: any) => typeof entry?.label === "string" && labels.includes(entry.label.trim().toLowerCase()));
    return Array.isArray(item?.children) ? item.children.filter((child: any) => child && child.label) : [];
  };
  const serviceLinks = c.on("footer_services_enabled") ? menuChildren("/services", "nav-services", ["services", "our services"]) : [];
  const areaLinks = c.on("footer_areas_enabled") ? menuChildren("/service-areas", "nav-service-areas", ["service areas", "areas", "areas we cover"]) : [];

  // Driver recruitment button: {whatsapp_number} / {business_name} placeholders, WhatsApp message added to wa.me links
  let driverHref = c.t("footer_driver_button_url").replace(/\{whatsapp_number\}/g, whatsappNum);
  const driverMessage = c.t("footer_driver_whatsapp_message").replace(/\{business_name\}/g, brandName).trim();
  if (/wa\.me\//i.test(driverHref) && !/[?&]text=/i.test(driverHref) && driverMessage) {
    driverHref += `${driverHref.includes("?") ? "&" : "?"}text=${encodeURIComponent(driverMessage)}`;
  }
  const driverExternal = /^https?:/i.test(driverHref);

  const columnCount = 2 + (serviceLinks.length > 0 ? 1 : 0) + (areaLinks.length > 0 ? 1 : 0);
  const columnGrid = columnCount === 4 ? "lg:grid-cols-4" : columnCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <footer className={`bg-brand-950 text-stone-400 ${isRenax ? "border-t border-white/10" : ""}`}>
      <div className="tl-container">
        {/* Top Highlights Box for Renax */}
        {isRenax && (
          <div className="grid grid-cols-1 gap-8 border-b border-white/10 py-10 md:grid-cols-3 md:gap-10">
            <div className="flex items-start gap-4">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className={columnHeading}>{c.t("footer_renax_call_label")}</p>
                <p className="mt-1.5 text-sm font-medium text-white">{formattedPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <div className="min-w-0">
                <p className={columnHeading}>{c.t("footer_renax_email_label")}</p>
                <p className="mt-1.5 truncate text-sm font-medium text-white">{emailAddr}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className={columnHeading}>{c.t("footer_renax_office_label")}</p>
                <p className="mt-1.5 text-sm font-medium text-white">{officeAddr}</p>
              </div>
            </div>
          </div>
        )}

        {/* Brand, link columns and contact details */}
        <div data-reveal-group className={`grid grid-cols-1 gap-x-12 gap-y-12 py-16 sm:grid-cols-2 lg:py-20 ${columnGrid}`}>
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-white">{brandName}</p>
            <address className="mt-4 max-w-[17rem] text-sm leading-relaxed text-stone-400 not-italic">
              {officeAddr}
            </address>

            {/* Social Media Quick Icons */}
            {showSocial && (
            <div className="mt-7 flex items-center text-stone-400">
              <span className={`mr-2 ${columnHeading}`}>{c.t("footer_follow_label")}</span>
              {showInstagram && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-200 hover:text-white"
                aria-label="Instagram"
                title={`${brandName} on Instagram`}
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              )}
              {showTiktok && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-200 hover:text-white"
                aria-label="TikTok"
                title={`${brandName} on TikTok`}
              >
                <TikTokIcon className="h-[18px] w-[18px]" />
              </a>
              )}
              {showPinterest && (
              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-200 hover:text-white"
                aria-label="Pinterest"
                title={`${brandName} on Pinterest`}
              >
                <PinterestIcon className="h-[18px] w-[18px]" />
              </a>
              )}
            </div>
            )}
          </div>

          {/* Services */}
          {serviceLinks.length > 0 && <FooterLinkColumn title={c.t("footer_services_heading")} links={serviceLinks} />}

          {/* Service areas */}
          {areaLinks.length > 0 && <FooterLinkColumn title={c.t("footer_areas_heading")} links={areaLinks} />}

          {/* Contact */}
          <div>
            <p className={columnHeading}>{c.t("footer_contact_heading")}</p>
            <ul className="mt-3 lg:mt-4">
              <li>
                <a href={phoneHref} className={columnLink}>
                  {formattedPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${emailAddr}`} className={`${columnLink} break-words`}>
                  {emailAddr}
                </a>
              </li>
              <li>
                <address className="max-w-[17rem] py-3 text-sm leading-relaxed text-stone-400 not-italic lg:py-1.5">
                  {officeAddr}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Elite Driver Recruitment Banner */}
        {c.on("footer_driver_enabled") && (
        <div data-reveal className="flex flex-col gap-6 border-y border-white/10 py-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <h3 className="tl-h3 text-white">
              {c.t("footer_driver_heading").replace(/\{business_name\}/g, brandName)}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-400">
              {c.t("footer_driver_text")}
            </p>
          </div>
          <a
            href={driverHref}
            target={driverExternal ? "_blank" : undefined}
            rel={driverExternal ? "noopener noreferrer" : undefined}
            className="tl-btn tl-btn-outline-light w-full shrink-0 md:w-auto"
          >
            {c.t("footer_driver_button_text")}
          </a>
        </div>
        )}

        {/* Footnote & Bottom Bar */}
        <div className="py-8 text-xs leading-relaxed text-stone-400">
          <p className="pr-16 sm:pr-0">
            {c.t("footer_info").replace(/\{business_name\}/g, brandName).replace(/\{year\}/g, String(new Date().getFullYear()))}
            {c.on("footer_credit_enabled") && (
            <>
            {" "}{c.t("footer_credit_prefix")}{" "}
            <a
              href={c.t("footer_credit_url")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-300 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white"
            >
              {c.t("footer_credit_name")}
            </a>
            </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
