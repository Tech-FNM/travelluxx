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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem("travelluxx_cached_settings");
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [pages, setPages] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem("travelluxx_cached_pages");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [services, setServices] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem("travelluxx_cached_services");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [servicesPageSettings, setServicesPageSettings] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem("travelluxx_cached_menu");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);

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
      setMenuItems(Array.isArray(menuItemsData) ? menuItemsData : []);
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
