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

// Action types for storage operations
const STORAGE_ACTIONS = {
  SET_PROVIDER_CONFIG: "SET_PROVIDER_CONFIG",
  SET_SYSTEM_PROMPT: "SET_SYSTEM_PROMPT",
  SELECT_PROVIDER: "SELECT_PROVIDER",
  ADD_TOOL: "ADD_TOOL",
  UPDATE_TOOL: "UPDATE_TOOL",
  DELETE_TOOL: "DELETE_TOOL",
  INIT: "INIT",
} as const;

const STORAGE_KEY = "storage" as const;

type StorageActionType = (typeof STORAGE_ACTIONS)[keyof typeof STORAGE_ACTIONS];

// Define all possible storage actions with their payload types
type StorageAction =
  | { type: typeof STORAGE_ACTIONS.INIT; payload: Storage }
  | {
      type: typeof STORAGE_ACTIONS.SET_PROVIDER_CONFIG;
      provider: ProviderType;
      config: ProviderSettings;
    }
  | { type: typeof STORAGE_ACTIONS.SET_SYSTEM_PROMPT; prompt: string }
  | {
      type: typeof STORAGE_ACTIONS.SELECT_PROVIDER;
      provider: ProviderType | null;
    }
  | {
      type: typeof STORAGE_ACTIONS.ADD_TOOL;
      platform: ToolPlatformType;
      tool: Omit<Tool, "id">;
    }
  | {
      type: typeof STORAGE_ACTIONS.UPDATE_TOOL;
      platform: ToolPlatformType;
      id: string;
      updates: Partial<Omit<Tool, "id">>;
    }
  | {
      type: typeof STORAGE_ACTIONS.DELETE_TOOL;
      platform: ToolPlatformType;
      id: string;
    };

// Pure reducer function to handle all state updates
const storageReducer = (state: Storage, action: StorageAction): Storage => {
  switch (action.type) {
    case STORAGE_ACTIONS.INIT:
      return action.payload;

    case STORAGE_ACTIONS.SET_PROVIDER_CONFIG:
      return {
        ...state,
        settings: {
          ...state.settings,
          providers: {
            ...state.settings.providers,
            [action.provider]: {
              ...state.settings.providers[action.provider],
              ...action.config,
            },
          },
        },
      };

    case STORAGE_ACTIONS.SET_SYSTEM_PROMPT:
      return {
        ...state,
        settings: {
          ...state.settings,
          general: { ...state.settings.general, systemPrompt: action.prompt },
        },
      };

    case STORAGE_ACTIONS.SELECT_PROVIDER:
      return {
        ...state,
        settings: {
          ...state.settings,
          general: {
            ...state.settings.general,
            activeProvider: action.provider,
          },
        },
      };

    case STORAGE_ACTIONS.ADD_TOOL:
      return {
        ...state,
        tools: {
          ...state.tools,
          [action.platform]: [
            ...state.tools[action.platform],
            { ...action.tool, id: crypto.randomUUID() },
          ],
        },
      };

    case STORAGE_ACTIONS.UPDATE_TOOL:
      return {
        ...state,
        tools: {
          ...state.tools,
          [action.platform]: state.tools[action.platform].map((t) =>
            t.id === action.id ? { ...t, ...action.updates } : t,
          ),
        },
      };

    case STORAGE_ACTIONS.DELETE_TOOL:
      return {
        ...state,
        tools: {
          ...state.tools,
          [action.platform]: state.tools[action.platform].filter(
            (t) => t.id !== action.id,
          ),
        },
      };
  }
};

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
