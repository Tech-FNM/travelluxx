import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  settings: any;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsLocally: (newSettings: any) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
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
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings, updateSettingsLocally }}>
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
