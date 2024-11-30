import type {
  LLMProviderSettings,
  Settings,
  Tool,
} from "@/contexts/storage-context";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type LanguageModelV1 } from "ai";

import { createSmartpostPro } from "@/lib/smartpost-pro-provider";
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
const TOOL_INPUT_PLACEHOLDER = "{post}";

export function createAIClient(provider: LLMProviderSettings) {
  switch (provider.type) {
    case "openai":
      return createOpenAI({
        apiKey: provider.apiKey,
        baseURL: provider.baseUrl,
      });

    case "anthropic":
      return createAnthropic({
        apiKey: provider.apiKey,
        baseURL: provider.baseUrl,
      });

    case "smartpost-pro":
      return createSmartpostPro({
        apiKey: provider.apiKey,
        baseURL: provider.baseUrl,
      });

    default:
      throw new Error("Unsupported provider.");
  }
}

export function getActiveModel(settings: Settings) {
  const activeProvider = settings.general.activeProvider;
  if (!activeProvider) {
    throw new Error("No active provider selected");
  }

  const provider = settings.providers[activeProvider];
  if (!provider?.apiKey) {
    throw new Error("No API key found, please set it in the settings.");
  }

  if (!provider.available) {
    throw new Error(
      "Selected provider is not available. Please check your settings.",
    );
  }

  const client = createAIClient(provider);
  return client(provider.model);
}

export async function enhancePost(post: string, settings: Settings) {
  const systemPrompt = settings.general.systemPrompt;
  const model = getActiveModel(settings);

  const { text } = await generateText({
    model: model as LanguageModelV1,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: post,
      },
    ],
  });
  return text;
}

export async function runTool(
  tool: Tool,
  input: string | null,
  settings: Settings,
) {
  const model = getActiveModel(settings);

  const prompt = tool.prompt.replace(TOOL_INPUT_PLACEHOLDER, `"${input}"`);
  console.debug(`Running tool ${tool.name}: ${prompt}`);
  const { text } = await generateText({
    model: model as LanguageModelV1,
    temperature: 1,
    messages: [{ role: "user", content: prompt }],
  });

  return text;
}
