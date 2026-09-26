import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Compass, Shield, Menu, X, ChevronDown } from "lucide-react";
import travelluxxLogo from "../assets/images/travelluxx_logo_1786403432815.jpg";
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
    const defaultImg = (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : travelluxxLogo;
    return getCustomImage("logo", defaultImg);
  };

  const [brandLogo, setBrandLogo] = useState<string>(getInitialLogo);

  useEffect(() => {
    const handleUpdate = () => {
      const customSetting = settings?.logo_url || settings?.logo_image || settings?.logoImage;
      const defaultImg = (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : travelluxxLogo;
      setBrandLogo(getCustomImage("logo", defaultImg));
    };

    handleUpdate();
    window.addEventListener("custom_images_updated", handleUpdate);
    return () => window.removeEventListener("custom_images_updated", handleUpdate);
  }, [settings]);

  // Removed local menuItems state and fetch, using context instead

  const isRenax = settings?.active_theme === "renax";

  // Check if a custom logo was uploaded (not the default bundled logo)
  const hasCustomLogo = (() => {
    const customSetting = settings?.logo_url || settings?.logo_image || settings?.logoImage;
    if (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") return true;
    return false;
  })();

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
      isRenax 
        ? "bg-[#0c0d12]/95 border-b border-slate-800/80 shadow-md text-white font-['Outfit']" 
        : "bg-white/95 border-b border-slate-200/80 shadow-sm font-sans"
    }`}>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 group/logo relative">
            <div className="relative flex items-center justify-center shrink-0 cursor-pointer" onClick={() => onScrollTo("hero")}>
              <img
                src={brandLogo}
                alt={`${brandName} Logo`}
                width={96}
                height={96}
                decoding="async"
                className="w-20 h-20 sm:w-[96px] sm:h-[96px] object-contain transition-transform duration-300 group-hover/logo:scale-105"
                referrerPolicy="no-referrer"
                onError={() => {
                  if (brandLogo !== travelluxxLogo) {
                    setBrandLogo(travelluxxLogo);
                  }
                }}
              />
            </div>
            
            {/* Only show brand name text if no custom logo is uploaded */}
            {!hasCustomLogo && (
              <div className="flex flex-col justify-center select-none cursor-pointer" onClick={() => onScrollTo("hero")}>
                <span className={`font-extrabold text-2xl sm:text-[28px] tracking-tight block leading-tight ${
                  isRenax ? "text-white font-bold" : "text-slate-900 font-sans"
                }`}>
                  {brandName}
                </span>
                <span className={`text-[11px] sm:text-[12px] tracking-[0.18em] block font-bold uppercase mt-0.5 leading-none ${
                  isRenax ? "text-emerald-400" : "text-emerald-600 font-sans"
                }`}>
                  - PRIVATE HIRE -
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-bold">
            {menuItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isAnchor = item.href?.startsWith("/#") || item.href?.startsWith("#");
              const sectionId = isAnchor ? item.href.split("#")[1] : "";

              if (hasChildren) {
                return (
                  <div key={item.id} className="relative group/dropdown py-2">
                    <div className="flex items-center gap-1 cursor-pointer">
                      {isAnchor && sectionId ? (
                        <button 
                          type="button"
                          onClick={() => onScrollTo(sectionId)} 
                          className={`transition cursor-pointer font-bold tracking-wide flex items-center gap-1 ${
                            isRenax ? "text-slate-200 group-hover/dropdown:text-emerald-400" : "text-slate-700 group-hover/dropdown:text-emerald-600"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                        </button>
                      ) : item.href?.startsWith("http") ? (
                        <a 
                          href={item.href || "#"} 
                          target={item.target || "_self"}
                          className={`transition cursor-pointer font-bold tracking-wide flex items-center gap-1 ${
                            isRenax ? "text-slate-200 group-hover/dropdown:text-emerald-400" : "text-slate-700 group-hover/dropdown:text-emerald-600"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                        </a>
                      ) : (
                        <Link 
                          to={item.href || "/"} 
                          className={`transition cursor-pointer font-bold tracking-wide flex items-center gap-1 ${
                            isRenax ? "text-slate-200 group-hover/dropdown:text-emerald-400" : "text-slate-700 group-hover/dropdown:text-emerald-600"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                        </Link>
                      )}
                    </div>

                    {/* Floating Dropdown Card */}
                    <div className="absolute top-full left-0 pt-2 z-50 min-w-[220px] opacity-0 translate-y-1 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-200 ease-out">
                      <div className={`rounded-xl shadow-2xl border p-2 backdrop-blur-xl ${
                        isRenax
                          ? "bg-[#0f121d]/95 border-slate-700/70 text-white shadow-black/60"
                          : "bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-300/40"
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
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                                  isRenax
                                    ? "hover:bg-white/10 hover:text-emerald-400 text-slate-200"
                                    : "hover:bg-emerald-50 hover:text-emerald-700 text-slate-700"
                                }`}
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
                                className={`block px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                  isRenax
                                    ? "hover:bg-white/10 hover:text-emerald-400 text-slate-200"
                                    : "hover:bg-emerald-50 hover:text-emerald-700 text-slate-700"
                                }`}
                              >
                                {child.label}
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={child.id}
                              to={child.href}
                              className={`block px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                isRenax
                                  ? "hover:bg-white/10 hover:text-emerald-400 text-slate-200"
                                  : "hover:bg-emerald-50 hover:text-emerald-700 text-slate-700"
                              }`}
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
                    className={`transition cursor-pointer font-bold tracking-wide ${
                      isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"
                    }`}
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
                    className={`transition cursor-pointer font-bold tracking-wide ${
                      isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link 
                  key={item.id}
                  to={item.href || "/"} 
                  className={`transition cursor-pointer font-bold tracking-wide ${
                    isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition focus:outline-none ${
                isRenax ? "text-white hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t py-4 px-6 shadow-lg ${
          isRenax ? "bg-[#12141c] border-slate-800 text-white font-['Outfit']" : "bg-white border-slate-150 text-slate-800"
        }`}>
          <div className="flex flex-col space-y-3">
            {menuItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isAnchor = item.href?.startsWith("/#") || item.href?.startsWith("#");
              const sectionId = isAnchor ? item.href.split("#")[1] : "";
              const isSubOpen = !!openMobileDropdowns[item.id];

              if (hasChildren) {
                return (
                  <div key={item.id} className="border-b border-slate-100/10 pb-2">
                    <div className="flex items-center justify-between py-2">
                      {isAnchor && sectionId ? (
                        <button
                          type="button"
                          onClick={() => {
                            onScrollTo(sectionId);
                            setIsOpen(false);
                          }}
                          className={`font-bold transition cursor-pointer text-sm ${
                            isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
                          }`}
                        >
                          {item.label}
                        </button>
                      ) : item.href?.startsWith("http") ? (
                        <a
                          href={item.href || "#"}
                          target={item.target || "_self"}
                          onClick={() => setIsOpen(false)}
                          className={`font-bold transition cursor-pointer text-sm ${
                            isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
                          }`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          to={item.href || "/"}
                          onClick={() => setIsOpen(false)}
                          className={`font-bold transition cursor-pointer text-sm ${
                            isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => setOpenMobileDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="p-1 text-slate-400 hover:text-emerald-500 transition"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {isSubOpen && (
                      <div className="pl-3 space-y-1 pt-1 border-l-2 border-emerald-500/40 ml-2">
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
                                className={`block w-full text-left py-1.5 text-xs font-semibold transition ${
                                  isRenax ? "text-slate-300 hover:text-emerald-400" : "text-slate-600 hover:text-emerald-600"
                                }`}
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
                                className={`block py-1.5 text-xs font-semibold transition ${
                                  isRenax ? "text-slate-300 hover:text-emerald-400" : "text-slate-600 hover:text-emerald-600"
                                }`}
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
                              className={`block py-1.5 text-xs font-semibold transition ${
                                isRenax ? "text-slate-300 hover:text-emerald-400" : "text-slate-600 hover:text-emerald-600"
                              }`}
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
                    className={`text-left font-bold py-2 transition cursor-pointer text-sm ${
                      isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
                    }`}
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
                    className={`text-left font-bold py-2 transition cursor-pointer text-sm ${
                      isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
                    }`}
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
                  className={`text-left font-bold py-2 transition cursor-pointer text-sm ${
                    isRenax ? "text-slate-200 hover:text-emerald-400" : "text-slate-800 hover:text-emerald-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
