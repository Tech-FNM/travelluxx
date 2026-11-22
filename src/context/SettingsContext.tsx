import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  settings: any;
  pages: any[];
  services: any[];
  posts: any[];
  servicesPageSettings: any;
  menuItems: any[];
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsLocally: (newSettings: any) => void;
}

const DEFAULT_FALLBACK_SETTINGS = {
  business_name: "Travelluxx",
  business_email: "info@travelluxx.co.uk",
  whatsapp_number: "441217140876",
  office_address: "Shirley B90 Shirley, Solihull, West Midlands, UK",
  hero_image: "",
  footer_info: "© 2026 Travelluxx. All rights reserved.",
  homepage_hero_badge: "TravelLuxx Private Hire",
  homepage_hero_title: "Private Hire Birmingham – Nationwide Airport Transfers",
  homepage_hero_subtitle: "Experience premium private travel in beautifully presented Mercedes-Benz and Audi vehicles. Every journey comes with a fixed rate and absolutely no surge pricing.",
  homepage_indicator1: "Licensed Professional Operators",
  homepage_indicator2: "Guaranteed Nationwide Coverage",
  homepage_hero_btn_text: "Calculate & Get Quote",
  homepage_hero_phone_text: "+44 1217 140876",
  homepage_fleet_title: "Travel in Premium Comfort",
  homepage_fleet_description: "Our curated Mercedes-Benz and Audi fleet is maintained to the highest safety and cosmetic standards.",
  homepage_airports_title: "Airport Transfers from Birmingham and Across the UK",
  airport_name_1: "Birmingham (BHX)",
  airport_code_1: "BHX",
  airport_name_2: "Heathrow",
  airport_code_2: "LHR",
  airport_name_3: "Gatwick",
  airport_code_3: "LGW",
  airport_name_4: "Luton",
  airport_code_4: "LTN",
  airport_name_5: "Stansted",
  airport_code_5: "STN",
  airport_name_6: "London City",
  airport_code_6: "LCY",
  service_title_1: "Airport Transfers",
  service_desc_1: "Reliable fixed-price transfers to Birmingham, Heathrow, Gatwick and all major UK airports.",
  service_title_2: "Port Transfers",
  service_desc_2: "Dependable transfers to and from Southampton, Dover and other UK cruise terminals.",
  service_title_3: "Station Transfers",
  service_desc_3: "Seamless private hire Birmingham pickups for rail stations, including New Street, and onward journeys to London and across the UK.",
  service_title_4: "Popular Cities",
  service_desc_4: "Travel to Solihull, Worcester, Cheltenham, Warwick, Leamington Spa, Coventry and cities across the UK in comfort and style.",
  service_title_5: "Business Travel",
  service_desc_5: "Our chauffeur service Birmingham gives executives and corporate teams punctual, professional and discreet travel.",
  active_theme: "default",
  homepage_displays: "default",
  seo_title: "Private Hire Birmingham | Airport Transfers & Chauffeurs | TravelLuxx",
  seo_description: "Book premium private hire Birmingham with fixed fares, no surge pricing and Mercedes-Benz and Audi vehicles. Airport, station and business transfers nationwide."
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<any>(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("travelluxx_cached_settings");
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    return DEFAULT_FALLBACK_SETTINGS;
  });
  const [pages, setPages] = useState<any[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("travelluxx_cached_pages");
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    return [];
  });
  const [services, setServices] = useState<any[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("travelluxx_cached_services");
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    return [];
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [servicesPageSettings, setServicesPageSettings] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("travelluxx_cached_menu");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {}
    return [
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
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const [
        settingsRes,
        pagesRes,
        servicesRes,
        postsRes,
        servicesPageSettingsRes,
        menuItemsRes
      ] = await Promise.all([
        fetch("/api/settings").catch(() => null),
        fetch("/api/pages").catch(() => null),
        fetch("/api/services").catch(() => null),
        fetch("/api/posts").catch(() => null),
        fetch("/api/services-page-settings").catch(() => null),
        fetch("/api/menu").catch(() => null)
      ]);

      const safeJson = async (res: Response | null, fallbackUrl?: string) => {
        if (!res || !res.ok) {
          if (fallbackUrl) {
            try {
              const fb = await fetch(fallbackUrl);
              if (fb.ok) return await fb.json();
            } catch (e) {}
          }
          return null;
        }
        try {
          return await res.json();
        } catch (e) {
          if (fallbackUrl) {
            try {
              const fb = await fetch(fallbackUrl);
              if (fb.ok) return await fb.json();
            } catch (err) {}
          }
          return null;
        }
      };

      const [
        settingsData,
        pagesData,
        servicesData,
        postsData,
        servicesPageSettingsData,
        menuItemsData
      ] = await Promise.all([
        safeJson(settingsRes, "/api/admin/settings"),
        safeJson(pagesRes),
        safeJson(servicesRes),
        safeJson(postsRes),
        safeJson(servicesPageSettingsRes),
        safeJson(menuItemsRes)
      ]);

      if (settingsData) {
        setSettings(settingsData);
        try {
          localStorage.setItem("travelluxx_cached_settings", JSON.stringify(settingsData));
        } catch (e) {}
      }
      setPages(Array.isArray(pagesData) ? pagesData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setPosts(Array.isArray(postsData) ? postsData : []);
      setServicesPageSettings(servicesPageSettingsData);
      if (Array.isArray(menuItemsData) && menuItemsData.length > 0) {
        setMenuItems(menuItemsData);
        try {
          localStorage.setItem("travelluxx_cached_menu", JSON.stringify(menuItemsData));
        } catch (e) {}
      } else {
        // Fallback default menu items if empty
        const defaultMenu = [
          { id: "nav-home", label: "Home", href: "/", target: "_self" },
          {
            id: "nav-services",
            label: "Services",
            href: "/services",
            target: "_self",
            children: Array.isArray(servicesData) && servicesData.length > 0
              ? servicesData.map((s: any) => ({
                  id: `srv-${s.slug}`,
                  label: s.title || s.name || s.slug,
                  href: `/services/${s.slug}`,
                  target: "_self"
                }))
              : [
                  { id: "srv-airport-transfers", label: "Airport Transfers", href: "/services/airport-transfers", target: "_self" },
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
              { id: "sa-warwick", label: "Chauffeur Warwick", href: "/service-areas/chauffeur-warwick", target: "_self" },
              { id: "sa-all-areas", label: "All Service Areas", href: "/service-areas", target: "_self" }
            ]
          },
          { id: "nav-blog", label: "Blog", href: "/blog", target: "_self" }
        ];
        setMenuItems(defaultMenu);
      }
    } catch (err) {
      console.error("Failed to load global data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const updateSettingsLocally = (newSettings: any) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, pages, services, posts, servicesPageSettings, menuItems, 
      isLoading, refreshSettings, updateSettingsLocally 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
