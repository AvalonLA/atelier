import React, { createContext, useContext, useEffect, useState } from "react";
import { AppConfig } from "../types";
import { ConfigService } from "../services/supabase";

interface ConfigContextType {
  config: AppConfig;
  updateLocalConfig: (updates: Partial<AppConfig>) => Promise<void>;
  isLoading: boolean;
}

const defaultConfig: AppConfig = {
  id: 0,
  site_name: "ATELIER",
  site_description: "Iluminación de Vanguardia",
  contact_email: "contact@atelier.com",
  contact_phone: "+54 9 11 1234 5678",
  opening_hours: "Lun - Vie: 10:00 - 19:00",
  ai_active: true,
  use_mock_data: true,
};

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  updateLocalConfig: async () => {},
  isLoading: true,
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await ConfigService.getConfig();
      if (data) {
        setConfig({ ...defaultConfig, ...data });
      } else {
          // If no data, we could try to create default entry, but for now just use local default
          // Optionally auto-create:
          // await ConfigService.updateConfig(defaultConfig); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalConfig = async (updates: Partial<AppConfig>) => {
     // Optimistic update
     setConfig(prev => ({ ...prev, ...updates }));
     try {
         await ConfigService.updateConfig(updates);
     } catch (e) {
         console.error("Failed to sync config:", e);
         // Rollback could go here
     }
  };

  return (
    <ConfigContext.Provider value={{ config, updateLocalConfig, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
