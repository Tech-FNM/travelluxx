import React from "react";
import { Phone, Mail, MapPin, Instagram, ExternalLink, ShieldCheck, Clock } from "lucide-react";

interface FooterProps {
  onScrollTo: (elementId: string) => void;
  onAdminClick?: () => void;
  settings?: any;
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

export default function Footer({ onScrollTo, onAdminClick, settings }: FooterProps) {
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

  return (
    <footer
      className={`pt-16 pb-8 text-slate-400 ${
        isRenax
          ? "bg-[#08080a] border-t border-slate-900 font-['Outfit']"
          : "bg-slate-950 border-t border-slate-900 font-sans"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Highlights Box for Renax */}
        {isRenax && (
          <div className="bg-[#0e1017] border border-slate-800/60 rounded-2xl p-6 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left shadow-lg">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Call Us</p>
                <p className="text-sm font-bold text-white mt-0.5">{formattedPhone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 justify-center md:justify-start border-t border-b md:border-t-0 md:border-b-0 border-slate-800/60 py-4 md:py-0 md:px-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Write to Us</p>
                <p className="text-sm font-bold text-white mt-0.5 truncate">{emailAddr}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 justify-center md:justify-start md:pl-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Head Office</p>
                <p className="text-sm font-bold text-white mt-0.5 line-clamp-1">{officeAddr}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Navigation & Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 pt-2 border-b border-slate-900/80">
          
          {/* Column 1: Brand & Social Channels (Colspan 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-base">
                T
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white uppercase block leading-none">
                  Travel<span className="text-emerald-400">luxx</span>
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold tracking-widest uppercase block mt-1">
                  Private Hire & Chauffeur
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Premier UK chauffeur service offering punctual, executive airport transfers, corporate travel, and long-distance private hire in modern luxury Mercedes-Benz and BMW vehicles.
            </p>

            {/* Social Media Links Section */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>Connect On Social Media</span>
              </p>
              
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TravelLuxx on Instagram"
                  className="group flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-amber-500 text-slate-300 hover:text-white border border-slate-800 hover:border-pink-500/40 shadow-sm transition-all duration-300 text-xs font-medium cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-pink-400 group-hover:text-white transition-colors" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* TikTok */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TravelLuxx on TikTok"
                  className="group flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-black text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-all duration-300 text-xs font-medium cursor-pointer"
                >
                  <TikTokIcon className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span>TikTok</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Pinterest */}
                <a
                  href={pinterestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TravelLuxx on Pinterest"
                  className="group flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-[#E60023] text-slate-300 hover:text-white border border-slate-800 hover:border-[#E60023]/50 hover:shadow-[0_0_12px_rgba(230,0,35,0.25)] transition-all duration-300 text-xs font-medium cursor-pointer"
                >
                  <PinterestIcon className="w-4 h-4 text-red-400 group-hover:text-white transition-colors" />
                  <span>Pinterest</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Colspan 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onScrollTo("calculator-section")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Instant Quote & Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("fleet-section")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Executive Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("airports-section")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Airport Transfers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("contact-section")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Contact Desk
                </button>
              </li>
              <li>
                <a href="/blog" className="hover:text-emerald-400 transition-colors block">
                  Travel Blog & News
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Major UK Airports (Colspan 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Airport Transfers</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-300">Birmingham Airport (BHX)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-300">London Heathrow (LHR)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-300">London Gatwick (LGW)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-300">Manchester Airport (MAN)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-300">London Luton & Stansted</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Dispatch Desk (Colspan 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Concierge</h4>
            <div className="space-y-3 text-xs">
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">{formattedPhone}</span>
              </a>
              <a
                href={`mailto:${emailAddr}`}
                className="flex items-center space-x-2.5 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{emailAddr}</span>
              </a>
              <div className="flex items-start space-x-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{officeAddr}</span>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  24/7 Booking & Dispatch Active
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Elite Driver Recruitment Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-8 my-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden group ${
            isRenax ? "bg-[#0e0f16] border border-slate-800/60" : "bg-slate-900/60 border border-slate-800/80"
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="font-display font-bold text-lg md:text-xl text-white tracking-tight">
              Are You a Professional Chauffeur?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Partner with TravelLuxx. We are continually recruiting licensed, professional chauffeurs with modern executive vehicles for nationwide transfers and high-profile clients.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNum}?text=Hi,%20I'm%20a%20licensed%20private%20hire%20driver%20and%20would%20like%20to%20apply%20to%20partner%20with%20${encodeURIComponent(brandName)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 hover:-translate-y-0.5 shrink-0 text-center cursor-pointer w-full md:w-auto relative z-10"
          >
            Apply to Join Fleet
          </a>
        </div>

        {/* Footnote & Bottom Bar */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-center sm:text-left ${
            isRenax ? "border-slate-900 text-slate-500" : "border-slate-900 text-slate-500"
          }`}
        >
          <p>
            © 2026 Travelluxx. All rights reserved - Develop & Managed By{" "}
            <a
              href="https://techfnm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-semibold"
            >
              Tech FNM
            </a>
          </p>

          {/* Bottom Social Media Quick Icons */}
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Follow us:</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors p-1"
              aria-label="Instagram"
              title="TravelLuxx on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors p-1"
              aria-label="TikTok"
              title="TravelLuxx on TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
            <a
              href={pinterestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors p-1"
              aria-label="Pinterest"
              title="TravelLuxx on Pinterest"
            >
              <PinterestIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
