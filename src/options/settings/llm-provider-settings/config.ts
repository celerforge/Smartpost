import type { LLMProvider } from "@/options/settings/llm-provider-settings/types";

export const PROVIDERS: LLMProvider[] = [
  {
    id: "smartpost-pro",
    name: "Smartpost Pro",
    description:
      "Access OpenAI and Anthropic models through Smartpost Pro subscription",
    fields: [
      {
        name: "model",
        type: "select",
        label: "Model",
        required: true,
        options: [
          { value: "gpt-4o-mini", label: "GPT-4o Mini" },
          { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
        ],
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Official API service for ChatGPT and GPT-4 models",
    fields: [
      {
        name: "apiKey",
        type: "password",
        label: "API Key",
        required: true,
        placeholder: "Enter your OpenAI API key",
        description:
          "Get your API key from https://platform.openai.com/api-keys",
      },
      {
        name: "baseUrl",
        type: "text",
        label: "Base URL",
        placeholder: "Enter custom API endpoint",
      },
      {
        name: "model",
        type: "select",
        label: "Model",
        required: true,
        options: [
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
          { value: "gpt-3.5-turbo-0125", label: "GPT-3.5 Turbo 0125" },
          { value: "gpt-3.5-turbo-1106", label: "GPT-3.5 Turbo 1106" },
          { value: "gpt-3.5-turbo-0613", label: "GPT-3.5 Turbo 0613" },
          { value: "gpt-4-1106-preview", label: "GPT-4 1106 Preview" },
          { value: "gpt-4-0125-preview", label: "GPT-4 0125 Preview" },
          { value: "gpt-4o", label: "GPT-4o" },
          { value: "gpt-4o-mini", label: "GPT-4o Mini" },
          { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
          { value: "gpt-4", label: "GPT-4" },
        ],
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Official API service for Claude models",
    fields: [
      {
        name: "apiKey",
        type: "password",
        label: "API Key",
        required: true,
        placeholder: "Enter your Anthropic API key",
        description:
          "Get your API key from https://console.anthropic.com/settings/keys",
      },
      {
        name: "model",
        type: "select",
        label: "Model",
        required: true,
        options: [
          { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
          { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
          { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet" },
          { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
          { value: "claude-2.1", label: "Claude 2.1" },
        ],
      },
    ],
  },
];
