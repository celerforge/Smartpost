import { SYSTEM_PROMPT } from "@/lib/ai";
import { Storage as PlasmoStorage } from "@plasmohq/storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface BaseLLMProviderSettings {
  apiKey?: string;
  model?: string;
  available?: boolean;
}

export interface SmartpostProviderSettings extends BaseLLMProviderSettings {
  type: "smartpost-pro";
}

export interface OpenAIProviderSettings extends BaseLLMProviderSettings {
  type: "openai";
  baseUrl?: string;
}

export interface AnthropicProviderSettings extends BaseLLMProviderSettings {
  type: "anthropic";
  baseUrl?: string;
}

export type LLMProviderSettings =
  | SmartpostProviderSettings
  | OpenAIProviderSettings
  | AnthropicProviderSettings;

export type LLMProviderType = LLMProviderSettings["type"];

export interface Tool {
  id: string;
  name: string;
  prompt: string;
}

export interface Settings {
  providers: Record<LLMProviderType, LLMProviderSettings>;
  general: {
    systemPrompt: string;
    activeProvider: LLMProviderType | null;
  };
}

export interface Storage {
  settings: Settings;
  tools: {
    x: Tool[];
  };
}
export type ToolPlatformType = keyof Storage["tools"];

interface StorageContextType {
  storage: Storage;
  isLoading: boolean;

  // Provider Configuration
  saveProviderConfig: (
    provider: LLMProviderType,
    config: {
      apiKey: string;
      baseUrl?: string;
      model: string;
      available: boolean;
    },
  ) => Promise<void>;

  // General Settings
  saveSystemPrompt: (prompt: string) => Promise<void>;
  selectProvider: (provider: LLMProviderType | null) => Promise<void>;

  // Tool Management
  addTool: (
    platform: ToolPlatformType,
    tool: Omit<Tool, "id">,
  ) => Promise<void>;
  updateTool: (
    platform: ToolPlatformType,
    id: string,
    tool: Partial<Omit<Tool, "id">>,
  ) => Promise<void>;
  deleteTool: (platform: ToolPlatformType, id: string) => Promise<void>;
}

const DEFAULT_STORAGE: Storage = {
  settings: {
    providers: {
      "smartpost-pro": {
        type: "smartpost-pro",
        apiKey: "",
        model: "gpt-4o-mini",
        available: false,
      },
      openai: {
        type: "openai",
        apiKey: "",
        model: "gpt-4o-mini",
        baseUrl: "",
        available: false,
      },
      anthropic: {
        type: "anthropic",
        apiKey: "",
        baseUrl: "",
        model: "claude-3-haiku-20240307",
        available: false,
      },
    },
    general: {
      systemPrompt: SYSTEM_PROMPT,
      activeProvider: null,
    },
  },
  tools: {
    x: [],
  },
};

const StorageContext = createContext<StorageContextType>(
  {} as StorageContextType,
);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};

const STORAGE_KEY = "storage" as const;

// Handles persistent storage operations
class StorageManager {
  private storage = new PlasmoStorage();

  // Helper function to deeply merge stored data with default values
  private mergeWithDefaults(
    stored: Partial<Storage>,
    defaults: Storage,
  ): Storage {
    const merged = { ...defaults };

    if (stored.settings) {
      // Merge provider settings
      if (stored.settings.providers) {
        Object.keys(stored.settings.providers).forEach((provider) => {
          if (provider in merged.settings.providers) {
            merged.settings.providers[provider as LLMProviderType] = {
              ...merged.settings.providers[provider as LLMProviderType],
              ...stored.settings.providers[provider as LLMProviderType],
            };
          }
        });
      }

      // Merge general settings
      if (stored.settings.general) {
        merged.settings.general = {
          ...merged.settings.general,
          ...stored.settings.general,
        };
      }
    }

    // Merge tools
    if (stored.tools) {
      merged.tools = {
        ...merged.tools,
        ...stored.tools,
      };
    }

    return merged;
  }

  // Load initial state from storage
  async load(): Promise<Storage> {
    const data = await this.storage.get(STORAGE_KEY);
    if (!data) return DEFAULT_STORAGE;

    try {
      const stored = JSON.parse(data) as Partial<Storage>;
      return this.mergeWithDefaults(stored, DEFAULT_STORAGE);
    } catch (error) {
      console.error("Failed to parse storage data:", error);
      return DEFAULT_STORAGE;
    }
  }

  // Persist state to storage
  async save(state: Storage): Promise<void> {
    await this.storage.set(STORAGE_KEY, JSON.stringify(state));
  }
}

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Storage>(DEFAULT_STORAGE);
  const [isLoading, setIsLoading] = useState(true);
  const storage = useMemo(() => new StorageManager(), []);

  useEffect(() => {
    storage
      .load()
      .then((data) => setState(data))
      .finally(() => setIsLoading(false));
  }, []);

  const saveProviderConfig = async (
    provider: LLMProviderType,
    config: {
      apiKey: string;
      baseUrl?: string;
      model: string;
      available: boolean;
    },
  ) => {
    const newState = {
      ...state,
      settings: {
        ...state.settings,
        providers: {
          ...state.settings.providers,
          [provider]: { ...state.settings.providers[provider], ...config },
        },
      },
    };
    await storage.save(newState);
    setState(newState);
  };

  const saveSystemPrompt = async (prompt: string) => {
    const newState = {
      ...state,
      settings: {
        ...state.settings,
        general: { ...state.settings.general, systemPrompt: prompt },
      },
    };
    await storage.save(newState);
    setState(newState);
  };

  const selectProvider = async (provider: LLMProviderType | null) => {
    const newState = {
      ...state,
      settings: {
        ...state.settings,
        general: { ...state.settings.general, activeProvider: provider },
      },
    };
    await storage.save(newState);
    setState(newState);
  };

  const addTool = async (
    platform: ToolPlatformType,
    tool: Omit<Tool, "id">,
  ) => {
    const newState = {
      ...state,
      tools: {
        ...state.tools,
        [platform]: [
          ...state.tools[platform],
          { ...tool, id: crypto.randomUUID() },
        ],
      },
    };
    await storage.save(newState);
    setState(newState);
  };

  const updateTool = async (
    platform: ToolPlatformType,
    id: string,
    updates: Partial<Omit<Tool, "id">>,
  ) => {
    const newState = {
      ...state,
      tools: {
        ...state.tools,
        [platform]: state.tools[platform].map((t) =>
          t.id === id ? { ...t, ...updates } : t,
        ),
      },
    };
    await storage.save(newState);
    setState(newState);
  };

  const deleteTool = async (platform: ToolPlatformType, id: string) => {
    const newState = {
      ...state,
      tools: {
        ...state.tools,
        [platform]: state.tools[platform].filter((t) => t.id !== id),
      },
    };
    await storage.save(newState);
    setState(newState);
  };

  return (
    <StorageContext.Provider
      value={{
        storage: state,
        isLoading,
        saveProviderConfig,
        saveSystemPrompt,
        selectProvider,
        addTool,
        updateTool,
        deleteTool,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};
