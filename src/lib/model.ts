import type { Settings } from "@/contexts/settings-context";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

export function getModel(settings: Settings) {
  const provider = settings.providers[settings.general.activeProvider];

  if (!provider?.apiKey) {
    throw new Error("No API key found, please set it in the settings.");
  }

  if (!provider.available) {
    throw new Error(
      "Selected provider is not available. Please check your settings.",
    );
  }

  if (settings.general.activeProvider === "openai") {
    const client = createOpenAI({
      apiKey: provider.apiKey,
      baseURL: provider.baseUrl,
    });
    return client(provider.model);
  } else if (settings.general.activeProvider === "anthropic") {
    const client = createAnthropic({
      apiKey: provider.apiKey,
      baseURL: provider.baseUrl,
    });
    return client(provider.model);
  }

  throw new Error("Unsupported provider");
}
