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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStorage } from "@/contexts/storage-context";
import { createAIClient } from "@/lib/ai";
import { ProviderFormControl } from "@/options/settings/llm-provider-settings/form-control";
import {
  type LLMProvider,
  type ProviderFormValues,
} from "@/options/settings/llm-provider-settings/types";
import { useSession } from "@clerk/chrome-extension";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateText, type LanguageModelV1 } from "ai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ProviderConfigDialog({
  provider,
  open,
  onOpenChange,
}: {
  provider: LLMProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { storage, saveProviderConfig } = useStorage();
  const { session } = useSession();

  const schema = z.object(
    provider.fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.required
          ? z.string().min(1, `${field.label} is required.`)
          : z.string().optional(),
      }),
      {},
    ),
  );

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      apiKey: storage.settings.providers[provider.id].apiKey || "",
      model: storage.settings.providers[provider.id].model || "",
    },
  });

  const onSubmit = async (data: any) => {
    const isAvailable = await testProvider(data);
    if (provider.id === "smartpost-pro") {
      data.apiKey = session?.user.id;
    }
    await saveProviderConfig(provider.id, {
      ...data,
      available: isAvailable,
    });
    onOpenChange(false);
    if (isAvailable) {
      toast.success("Provider configuration saved successfully.");
    }
  };

  const testProvider = async (config: any) => {
    try {
      if (provider.id === "smartpost-pro" && !session?.user.id) {
        toast.error(
          "Smartpost Pro requires a valid user session. Please sign in to continue.",
        );
        return false;
      }
      const client = createAIClient({
        ...config,
        apiKey: config.apiKey,
        type: provider.id,
      });

      const model = client(config.model);

      await generateText({
        model: model as LanguageModelV1,
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
            {provider.fields.map((field) => (
              <FormField<ProviderFormValues>
                key={field.name}
                control={form.control}
                name={field.name as keyof ProviderFormValues}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <ProviderFormControl field={field} formField={formField} />
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

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
