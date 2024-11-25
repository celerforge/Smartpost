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

export interface ProviderSettings {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  available?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  prompt: string;
}

export interface Settings {
  providers: {
    openai: ProviderSettings;
    anthropic: ProviderSettings;
  };
  general: {
    systemPrompt: string;
    activeProvider: ProviderType | null;
  };
}

export interface Storage {
  settings: Settings;
  tools: {
    x: Tool[];
  };
}

export type ProviderType = keyof Storage["settings"]["providers"];
export type ToolPlatformType = keyof Storage["tools"];

interface StorageContextType {
  storage: Storage;
  isLoading: boolean;

  // Provider Configuration
  saveProviderConfig: (
    provider: ProviderType,
    config: {
      apiKey: string;
      baseUrl?: string;
      model: string;
      available: boolean;
    },
  ) => Promise<void>;

  // General Settings
  saveSystemPrompt: (prompt: string) => Promise<void>;
  selectProvider: (provider: ProviderType | null) => Promise<void>;

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
      openai: {
        apiKey: "",
        model: "gpt-4o-mini",
        available: false,
      },
      anthropic: {
        apiKey: "",
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

  // Load initial state from storage
  async load(): Promise<Storage> {
    const data = await this.storage.get(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_STORAGE;
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
    provider: ProviderType,
    config: ProviderSettings,
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

  const selectProvider = async (provider: ProviderType | null) => {
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
