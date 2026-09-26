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
  const [settings, setSettings] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [servicesPageSettings, setServicesPageSettings] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const [
        settingsRes,
        pagesRes,
        servicesRes,
        postsRes,
        servicesPageSettingsRes,
        menuItemsRes
      ] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/pages"),
        fetch("/api/services"),
        fetch("/api/posts"),
        fetch("/api/services-page-settings"),
        fetch("/api/menu")
      ]);

      const [
        settingsData,
        pagesData,
        servicesData,
        postsData,
        servicesPageSettingsData,
        menuItemsData
      ] = await Promise.all([
        settingsRes.json(),
        pagesRes.json(),
        servicesRes.json(),
        postsRes.json(),
        servicesPageSettingsRes.json(),
        menuItemsRes.json()
      ]);

      setSettings(settingsData);
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
