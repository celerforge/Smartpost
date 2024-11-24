import { FormButton } from "@/components/form-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/settings-context";
import { getModel } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateText } from "ai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface Provider {
  id: "openai" | "anthropic";
  name: string;
  description: string;
}

const PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Official API service for ChatGPT and GPT-4 models",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Official API service for Claude models",
  },
];

const providerConfigSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().optional(),
  model: z.string().optional(),
  available: z.boolean().optional(),
});

type ProviderFormValues = z.infer<typeof providerConfigSchema>;

const PROVIDER_MODELS = {
  openai: [
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
  anthropic: [
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
    { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
    { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
    { value: "claude-2.1", label: "Claude 2.1" },
  ],
} as const;

function ProviderConfigDialog({
  provider,
  open,
  onOpenChange,
}: {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { settings, updateProvider } = useSettings();
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerConfigSchema),
    defaultValues: {
      apiKey: settings.providers[provider.id].apiKey || "",
      baseUrl: settings.providers[provider.id].baseUrl || "",
      model: settings.providers[provider.id].model || "",
      available: settings.providers[provider.id].available || true,
    },
  });

  const onSubmit = async (data: ProviderFormValues) => {
    const isAvailable = await testProvider(data);
    await updateProvider(provider.id, {
      apiKey: data.apiKey,
      baseUrl: data.baseUrl,
      model: data.model,
      available: isAvailable,
    });
    onOpenChange(false);
    if (isAvailable) {
      toast.success("Provider configuration saved successfully.");
    }
  };

  const testProvider = async (config: ProviderFormValues) => {
    try {
      const model = getModel(settings);

      await generateText({
        model,
        prompt: "test.",
        maxTokens: 1,
      });
      return true;
    } catch (error) {
      console.error("Configuration test failed:", error);
      toast.error(
        "Configuration test failed. Please check your settings or open the console for detailed error information.",
      );
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {provider.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="sp-space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={`Enter your ${provider.name} API key`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom API endpoint" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROVIDER_MODELS[provider.id].map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="sp-flex sp-justify-end sp-space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <FormButton type="submit">Save</FormButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ModelProviderSettings() {
  const { settings } = useSettings();
  const [configuring, setConfiguring] = useState<Provider["id"] | null>(null);

  return (
    <div className="sp-space-y-6">
      <div>
        <h3 className="sp-text-lg sp-font-medium">
          AI Model Provider Settings
        </h3>
        <p className="sp-text-muted-foreground sp-text-sm">
          Configure and manage your AI service providers
        </p>
      </div>

      <div className="sp-grid sp-gap-4">
        {PROVIDERS.map((provider) => {
          const isAvailable = settings.providers[provider.id].available;

          return (
            <div
              key={provider.id}
              className="sp-flex sp-items-center sp-justify-between sp-rounded-lg sp-border sp-p-4"
            >
              <div className="sp-flex sp-items-center sp-space-x-4">
                <div className="sp-space-y-1">
                  <div className="sp-flex sp-items-center sp-gap-2">
                    <h4 className="sp-text-base">{provider.name}</h4>
                    <span
                      className={cn(
                        "sp-text-sm",
                        isAvailable ? "sp-text-green-600" : "sp-text-red-600",
                      )}
                    >
                      • {isAvailable ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  <p className="sp-text-secondary-foreground sp-text-sm">
                    {provider.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfiguring(provider.id)}
              >
                Configure
              </Button>
            </div>
          );
        })}

        {configuring && (
          <ProviderConfigDialog
            provider={PROVIDERS.find((p) => p.id === configuring)!}
            open={true}
            onOpenChange={(open) => !open && setConfiguring(null)}
          />
        )}
      </div>
    </div>
  );
}
