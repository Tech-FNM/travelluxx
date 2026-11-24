import { Phone, Mail, MapPin, Instagram } from "lucide-react";

import { Link } from "../utils/routerCompat";
import { useSettings } from "../context/SettingsContext";

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

// Same fallback list the Navbar uses when no menu has been saved yet
const fallbackMenuItems = [
  { id: "nav-home", label: "Home", href: "/", target: "_self" },
  {
    id: "nav-services",
    label: "Services",
    href: "/services",
    target: "_self",
    children: [
      { id: "srv-airport-transfers", label: "Local Airport Transfers Birmingham", href: "/services/airport-transfers", target: "_self" },
      { id: "srv-private-transfers", label: "Private Transfers", href: "/services/private-transfers", target: "_self" },
      { id: "srv-long-distance-travel", label: "Long Distance Travel", href: "/services/long-distance-travel", target: "_self" },
      { id: "srv-business-travel", label: "Business Travel", href: "/services/business-travel", target: "_self" },
      { id: "srv-all-services", label: "All Services", href: "/services", target: "_self" }
    ]
  },
  {
    id: "nav-service-areas",
    label: "Service Areas",
    href: "/service-areas",
    target: "_self",
    children: [
      { id: "sa-solihull", label: "Solihull", href: "/service-areas/chauffeur-solihull", target: "_self" },
      { id: "sa-coventry", label: "Chauffeur Coventry", href: "/service-areas/chauffeur-coventry", target: "_self" },
      { id: "sa-leamington-spa", label: "Chauffeur Leamington Spa", href: "/service-areas/chauffeur-leamington-spa", target: "_self" },
      { id: "sa-warwick", label: "Chauffeur Warwick", href: "/service-areas/chauffeur-warwick", target: "_self" },
      { id: "sa-all-areas", label: "All Service Areas", href: "/service-areas", target: "_self" }
    ]
  },
  { id: "nav-blog", label: "Blog", href: "/blog", target: "_self" }
];

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
            {child.href?.startsWith("http") ? (
              <a
                href={child.href}
                target={child.target || "_self"}
                rel={child.target === "_blank" ? "noopener noreferrer" : undefined}
                className={columnLink}
              >
                {child.label}
              </a>
            ) : (
              <Link to={child.href || "/"} className={columnLink}>
                {child.label}
              </Link>
            )}
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

  // Social media URLs
  const instagramUrl = settings?.social_instagram || "https://www.instagram.com/trave_lluxx/";
  const tiktokUrl = settings?.social_tiktok || "https://www.tiktok.com/@traveluxx";
  const pinterestUrl = settings?.social_pinterest || "https://uk.pinterest.com/travelluxx01/";

  const isRenax = settings?.active_theme === "renax";

  const formattedPhone = whatsappNum.startsWith("44")
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}`
    : whatsappNum;
  const phoneHref = whatsappNum.startsWith("44") ? `tel:+${whatsappNum}` : `tel:${whatsappNum}`;

  // Link columns: children of the "Services" and "Service Areas" menu items
  const activeNavItems = (Array.isArray(menuItems) && menuItems.length > 0) ? menuItems : fallbackMenuItems;
  const menuChildren = (label: string, id: string, href: string): any[] => {
    const wanted = label.toLowerCase();
    const item =
      activeNavItems.find((entry: any) => typeof entry?.label === "string" && entry.label.trim().toLowerCase() === wanted) ||
      activeNavItems.find((entry: any) => entry?.id === id || entry?.href === href);
    return Array.isArray(item?.children) ? item.children.filter((child: any) => child && child.label) : [];
  };
  const serviceLinks = menuChildren("Services", "nav-services", "/services");
  const areaLinks = menuChildren("Service Areas", "nav-service-areas", "/service-areas");

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
                <p className={columnHeading}>Call Us</p>
                <p className="mt-1.5 text-sm font-medium text-white">{formattedPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <div className="min-w-0">
                <p className={columnHeading}>Write to Us</p>
                <p className="mt-1.5 truncate text-sm font-medium text-white">{emailAddr}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className={columnHeading}>Head Office</p>
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
            <div className="mt-7 flex items-center text-stone-400">
              <span className={`mr-2 ${columnHeading}`}>Follow us:</span>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-200 hover:text-white"
                aria-label="Instagram"
                title="TravelLuxx on Instagram"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-200 hover:text-white"
                aria-label="TikTok"
                title="TravelLuxx on TikTok"
              >
                <TikTokIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-200 hover:text-white"
                aria-label="Pinterest"
                title="TravelLuxx on Pinterest"
              >
                <PinterestIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* Services */}
          {serviceLinks.length > 0 && <FooterLinkColumn title="Services" links={serviceLinks} />}

          {/* Service areas */}
          {areaLinks.length > 0 && <FooterLinkColumn title="Service areas" links={areaLinks} />}

          {/* Contact */}
          <div>
            <p className={columnHeading}>Contact</p>
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
        <div data-reveal className="flex flex-col gap-6 border-y border-white/10 py-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <h3 className="tl-h3 text-white">
              Join TravelLuxx
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-400">
              Looking for professional driver jobs? We are recruiting premium chauffeurs in Birmingham.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNum}?text=Hi,%20I'm%20a%20licensed%20private%20hire%20driver%20and%20would%20like%20to%20apply%20to%20partner%20with%20${encodeURIComponent(brandName)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="tl-btn tl-btn-outline-light w-full shrink-0 md:w-auto"
          >
            Apply Now
          </a>
        </div>

        {/* Footnote & Bottom Bar */}
        <div className="py-8 text-xs leading-relaxed text-stone-400">
          <p className="pr-16 sm:pr-0">
            © 2026 Travelluxx. All rights reserved - Develop & Managed By{" "}
            <a
              href="https://techfnm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-300 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white"
            >
              Tech FNM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
