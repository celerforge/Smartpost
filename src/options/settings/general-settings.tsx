import { FormButton } from "@/components/form-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStorage, type LLMProviderType } from "@/contexts/storage-context";
import { RoutePaths } from "@/options/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const generalSettingsSchema = z.object({
  activeProvider: z.string().nullable(),
  systemPrompt: z.string().min(1, "System prompt is required"),
});

type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>;

export function GeneralSettings() {
  const { storage, saveSystemPrompt, selectProvider } = useStorage();
  console.log(storage.settings.general.activeProvider);
  const form = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      activeProvider: storage.settings.general.activeProvider,
      systemPrompt: storage.settings.general.systemPrompt,
    },
  });

  const onSubmit = async (data: GeneralSettingsForm) => {
    try {
      console.log("save", data.activeProvider);
      await selectProvider(data.activeProvider as LLMProviderType | null);
      await saveSystemPrompt(data.systemPrompt);
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Failed to save settings. ");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="sp-space-y-6">
        <div>
          <h3 className="sp-text-lg sp-font-medium">General Settings</h3>
          <p className="sp-text-muted-foreground sp-text-sm">
            Configure the general settings for the extension
          </p>
        </div>

        <FormField
          control={form.control}
          name="activeProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLM Model Provider</FormLabel>
              <Select
                value={field.value || "none"}
                onValueChange={(value) =>
                  field.onChange(value === "none" ? null : value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(storage.settings.providers)
                    .filter(([_, provider]) => provider.available)
                    .map(([id]) => (
                      <SelectItem key={id} value={id}>
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {Object.entries(storage.settings.providers).filter(
                ([_, provider]) => provider.available,
              ).length === 0 && (
                <FormDescription>
                  No LLM providers are available. Please configure an LLM
                  provider first in the{" "}
                  <a
                    href={RoutePaths.SETTINGS_LLM_PROVIDER}
                    className="sp-underline"
                  >
                    Providers tab
                  </a>
                  .
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter system prompt..."
                  className="sp-min-h-[200px]"
                  {...field}
                  rows={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormButton type="submit">Save Settings</FormButton>
      </form>
    </Form>
  );
}
