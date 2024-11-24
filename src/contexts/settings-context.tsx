import { SYSTEM_PROMPT } from "@/lib/ai";
import { Storage } from "@plasmohq/storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface ProviderSettings {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  available?: boolean;
}

export interface Settings {
  providers: {
    openai: ProviderSettings;
    anthropic: ProviderSettings;
  };
  general: {
    systemPrompt: string;
    activeProvider: ProviderId | null;
  };
}

export type ProviderId = keyof Settings["providers"];
export const DEFAULT_MODEL = {
  openai: "gpt-4o-mini",
  anthropic: "claude-3-haiku-20240307",
} as const;

const DEFAULT_SETTINGS: Settings = {
  providers: {
    openai: {
      apiKey: "",
      baseUrl: "",
      model: DEFAULT_MODEL.openai,
      available: false,
    },
    anthropic: {
      apiKey: "",
      baseUrl: "",
      model: DEFAULT_MODEL.anthropic,
      available: false,
    },
  },
  general: {
    systemPrompt: SYSTEM_PROMPT,
    activeProvider: "openai",
  },
};

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateProvider: (
    providerId: ProviderId,
    settings: Partial<ProviderSettings>,
  ) => Promise<void>;
  updateGeneral: (settings: Partial<Settings["general"]>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  updateProvider: async () => {},
  updateGeneral: async () => {},
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
): T => {
  const result = { ...target };

  for (const key in source) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(target[key], value) as T[Extract<
        keyof T,
        string
      >];
    } else if (value !== undefined) {
      result[key] = value as T[Extract<keyof T, string>];
    }
  }

  return result;
};

export const STORAGE_KEYS = {
  SETTINGS: "settings",
} as const;

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateProvider = async (
    providerId: ProviderId,
    settings: Partial<ProviderSettings>,
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      providers: {
        ...prevSettings.providers,
        [providerId]: {
          ...prevSettings.providers[providerId],
          ...settings,
        },
      },
    }));
  };

  const updateGeneral = async (
    generalSettings: Partial<Settings["general"]>,
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      general: {
        ...prevSettings.general,
        ...generalSettings,
      },
    }));
  };

  useEffect(() => {
    const storage = new Storage();
    storage.get(STORAGE_KEYS.SETTINGS).then((storedSettings) => {
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings) as Settings;
        const mergedSettings = deepMerge(DEFAULT_SETTINGS, parsedSettings);
        setSettings(mergedSettings);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const storage = new Storage();
    storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateProvider,
        updateGeneral,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
