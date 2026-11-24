import React, { useState, useEffect } from "react";
import { Link } from "../utils/routerCompat";
import { Menu, X, ChevronDown } from "lucide-react";
import { travelluxxLogoBase64 } from "../assets/travelluxx_logo_datauri";
import { trackClick } from "../utils/analytics";
import { getCustomImage } from "../utils/customImages";
import { useSettings } from "../context/SettingsContext";

interface NavbarProps {
  onScrollTo: (elementId: string) => void;
  onAdminClick?: () => void;
}

export default function Navbar({ onScrollTo, onAdminClick }: NavbarProps) {
  const { settings, menuItems } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<{ [id: string]: boolean }>({});

  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";

  const getInitialLogo = () => {
    const customSetting = settings?.logo_url || settings?.logo_image || settings?.logoImage;
    const defaultImg = (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : travelluxxLogoBase64;
    return getCustomImage("logo", defaultImg);
  };

  const [brandLogo, setBrandLogo] = useState<string>(getInitialLogo);

  useEffect(() => {
    const handleUpdate = () => {
      const customSetting = settings?.logo_url || settings?.logo_image || settings?.logoImage;
      const defaultImg = (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : travelluxxLogoBase64;
      setBrandLogo(getCustomImage("logo", defaultImg));
    };

    handleUpdate();
    window.addEventListener("custom_images_updated", handleUpdate);
    return () => window.removeEventListener("custom_images_updated", handleUpdate);
  }, [settings]);

  const isRenax = settings?.active_theme === "renax";

  // Phone number, formatted the same way as the footer (+44 1217 140876)
  const whatsappNum = String(settings?.whatsapp_number || "441217140876");
  const formattedPhone = whatsappNum.startsWith("44")
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}`
    : whatsappNum;
  const phoneHref = whatsappNum.startsWith("44") ? `tel:+${whatsappNum}` : `tel:${whatsappNum}`;

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

  const activeNavItems = (Array.isArray(menuItems) && menuItems.length > 0) ? menuItems : fallbackMenuItems;

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

  return (
    <header className={`sticky top-0 z-50 border-b ${barTone}`}>
      {/* Main Navbar */}
      <div className="tl-container">
        <div className="flex h-[72px] items-center justify-between gap-6 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">

          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex shrink-0 cursor-pointer items-center justify-center" onClick={() => onScrollTo("hero")}>
              <img
                src={brandLogo || travelluxxLogoBase64}
                alt={`${brandName} Logo`}
                width={260}
                height={80}
                decoding="async"
                className="h-11 w-auto max-w-[180px] object-contain lg:h-12 lg:max-w-[200px]"
                onError={() => {
                  if (brandLogo !== travelluxxLogoBase64) {
                    setBrandLogo(travelluxxLogoBase64);
                  }
                }}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main" className="hidden h-full items-center gap-9 lg:flex">
            {activeNavItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isAnchor = item.href?.startsWith("/#") || item.href?.startsWith("#");
              const sectionId = isAnchor ? item.href.split("#")[1] : "";

              if (hasChildren) {
                return (
                  <div key={item.id} className="group/dropdown relative flex h-full items-center">
                    {isAnchor && sectionId ? (
                      <button
                        type="button"
                        onClick={() => onScrollTo(sectionId)}
                        className={deskParentLink}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 opacity-60" strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    ) : item.href?.startsWith("http") ? (
                      <a
                        href={item.href || "#"}
                        target={item.target || "_self"}
                        className={deskParentLink}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 opacity-60" strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        to={item.href || "/"}
                        className={deskParentLink}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 opacity-60" strokeWidth={1.5} aria-hidden="true" />
                      </Link>
                    )}

                    {/* Dropdown panel: hangs from the bar's hairline; opens on hover and on keyboard focus */}
                    <div className="invisible absolute top-full -left-5 z-50 group-hover/dropdown:visible group-has-[:focus-visible]/dropdown:visible">
                      <div className={`max-h-[calc(100vh-7rem)] w-max max-w-[340px] min-w-[240px] overflow-y-auto rounded-sm border py-2 shadow-sm ${isRenax
                          ? "bg-brand-950 border-white/10"
                          : "bg-white border-stone-200"
                        }`}>
                        {item.children.map((child: any) => {
                          const childIsAnchor = child.href?.startsWith("/#") || child.href?.startsWith("#");
                          const childSectionId = childIsAnchor ? child.href.split("#")[1] : "";

                          if (childIsAnchor && childSectionId) {
                            return (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => onScrollTo(childSectionId)}
                                className={deskChildLink}
                              >
                                <span>{child.label}</span>
                              </button>
                            );
                          }
                          if (child.href?.startsWith("http")) {
                            return (
                              <a
                                key={child.id}
                                href={child.href}
                                target={child.target || "_self"}
                                className={deskChildLink}
                              >
                                {child.label}
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={child.id}
                              to={child.href}
                              className={deskChildLink}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              if (isAnchor && sectionId) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onScrollTo(sectionId)}
                    className={deskLink}
                  >
                    {item.label}
                  </button>
                );
              }

              if (item.href?.startsWith("http")) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.target || "_self"}
                    className={deskLink}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.href || "/"}
                  className={deskLink}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop contact: phone + quote */}
          <div className="hidden items-center justify-end gap-7 lg:flex">
            <a
              href={phoneHref}
              className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${isRenax ? "text-stone-200 hover:text-brand-300" : "text-stone-900 hover:text-brand-700"
                }`}
            >
              {formattedPhone}
            </a>
            <a
              href="/#calculator-section"
              className={`tl-btn h-11 px-5 ${isRenax ? "tl-btn-light" : "tl-btn-primary"}`}
            >
              Get a quote
            </a>
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
                const isAnchor = item.href?.startsWith("/#") || item.href?.startsWith("#");
                const sectionId = isAnchor ? item.href.split("#")[1] : "";
                const isSubOpen = !!openMobileDropdowns[item.id];

                if (hasChildren) {
                  return (
                    <div key={item.id}>
                      <div className="flex items-center justify-between gap-2">
                        {isAnchor && sectionId ? (
                          <button
                            type="button"
                            onClick={() => {
                              onScrollTo(sectionId);
                              setIsOpen(false);
                            }}
                            className={`${mobLink} flex-1`}
                          >
                            {item.label}
                          </button>
                        ) : item.href?.startsWith("http") ? (
                          <a
                            href={item.href || "#"}
                            target={item.target || "_self"}
                            onClick={() => setIsOpen(false)}
                            className={`${mobLink} flex-1`}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            to={item.href || "/"}
                            onClick={() => setIsOpen(false)}
                            className={`${mobLink} flex-1`}
                          >
                            {item.label}
                          </Link>
                        )}
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
                          {item.children.map((child: any) => {
                            const childIsAnchor = child.href?.startsWith("/#") || child.href?.startsWith("#");
                            const childSectionId = childIsAnchor ? child.href.split("#")[1] : "";

                            if (childIsAnchor && childSectionId) {
                              return (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => {
                                    onScrollTo(childSectionId);
                                    setIsOpen(false);
                                  }}
                                  className={mobChildLink}
                                >
                                  {child.label}
                                </button>
                              );
                            }
                            if (child.href?.startsWith("http")) {
                              return (
                                <a
                                  key={child.id}
                                  href={child.href}
                                  target={child.target || "_self"}
                                  onClick={() => setIsOpen(false)}
                                  className={mobChildLink}
                                >
                                  {child.label}
                                </a>
                              );
                            }

                            return (
                              <Link
                                key={child.id}
                                to={child.href}
                                onClick={() => setIsOpen(false)}
                                className={mobChildLink}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (isAnchor && sectionId) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onScrollTo(sectionId);
                        setIsOpen(false);
                      }}
                      className={mobLink}
                    >
                      {item.label}
                    </button>
                  );
                }

                if (item.href?.startsWith("http")) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.target || "_self"}
                      onClick={() => setIsOpen(false)}
                      className={mobLink}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={item.href || "/"}
                    onClick={() => setIsOpen(false)}
                    className={mobLink}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile contact: quote + phone */}
            <div className="flex flex-col gap-3 pt-6">
              <a
                href="/#calculator-section"
                onClick={() => setIsOpen(false)}
                className={`tl-btn w-full ${isRenax ? "tl-btn-light" : "tl-btn-primary"}`}
              >
                Get a quote
              </a>
              <a
                href={phoneHref}
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
