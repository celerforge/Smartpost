import type { Settings } from "@/contexts/settings-context";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

import { createAnthropic } from "@ai-sdk/anthropic";

export const SYSTEM_PROMPT = `You are a content optimizer. ALWAYS optimize the input content, regardless of length or quality.

OPTIMIZATION RULES:
1. Improve clarity and engagement while preserving the original message
2. Maintain the original tone and style
3. Enhance readability through better structure and word choice
4. Keep the content concise and impactful

OUTPUT RULES:
- Output ONLY the optimized content
- NEVER add any explanations, comments, or other text
- If input is very short, still optimize and return it
- If input seems incomplete, optimize what is provided
- NEVER refuse to optimize or ask for more content

REMEMBER: Your response must contain ONLY the optimized version of the input text.`;

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

export async function enhancePost(post: string, settings: Settings) {
  const systemPrompt = settings.general.systemPrompt;

  const model = getModel(settings);

  const { text } = await generateText({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: post,
      },
    ],
  });
  console.debug(`enhanced ${post} to ${text}`);

  return text;
}
