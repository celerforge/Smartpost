import { SMARTPOST_API_URL } from "@/lib/env";
import { generateId } from "@ai-sdk/provider-utils";
import type { LanguageModelV1, LanguageModelV1StreamPart } from "ai";

export interface SmartpostProSettings {
  temperature?: number;
  [key: string]: unknown;
}

export class SmartpostProLanguageModel implements LanguageModelV1 {
  readonly id: string;
  readonly provider: string;
  readonly specificationVersion = "v1";
  readonly defaultObjectGenerationMode = "json" as const;

  constructor(
    public readonly modelId: string,
    private readonly settings: SmartpostProSettings = {},
    private readonly config: {
      baseURL: string;
      apiKey: string;
    },
  ) {
    this.id = generateId();
    this.provider = "smartpost-pro";
  }

  async doStream(options: Parameters<LanguageModelV1["doStream"]>[0]): Promise<{
    stream: ReadableStream<LanguageModelV1StreamPart>;
    rawCall: {
      rawPrompt: unknown;
      rawSettings: Record<string, unknown>;
    };
    rawResponse?: {
      headers?: Record<string, string>;
    };
    request?: {
      body: string;
    };
  }> {
    throw new Error("Streaming not supported.");
  }

  async doGenerate(
    options: Parameters<LanguageModelV1["doGenerate"]>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1["doGenerate"]>>> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.modelId,
        messages: [{ role: "user", content: options.prompt }],
        temperature: this.settings.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices[0];

    return {
      text: choice.message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
      },
      finishReason: choice.finish_reason,
      logprobs: null,
      rawCall: {
        rawPrompt: options.prompt,
        rawSettings: {} as Record<string, unknown>,
      },
      rawResponse: {
        headers: Object.fromEntries(response.headers.entries()),
      },
      response: data,
      warnings: [],
      request: {
        body: JSON.stringify({
          model: this.modelId,
          messages: [{ role: "user", content: options.prompt }],
          temperature: this.settings.temperature,
        }),
      },
    };
  }
}

export function createSmartpostPro(options: {
  baseURL: string;
  apiKey: string;
}) {
  return (modelId: string, settings?: SmartpostProSettings) =>
    new SmartpostProLanguageModel(modelId, settings, {
      baseURL: options.baseURL || SMARTPOST_API_URL,
      apiKey: options.apiKey,
    });
}
