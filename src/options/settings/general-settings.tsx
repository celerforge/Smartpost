import { FormButton } from "@/components/form-button";
import {
  Form,
  FormControl,
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
import type { ProviderId } from "@/contexts/settings-context";
import { useSettings } from "@/contexts/settings-context";
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
  const { settings, updateGeneral } = useSettings();
  const form = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      activeProvider: settings.general.activeProvider,
      systemPrompt: settings.general.systemPrompt,
    },
  });

  const onSubmit = async (data: GeneralSettingsForm) => {
    try {
      await updateGeneral({
        activeProvider: data.activeProvider as ProviderId | null,
        systemPrompt: data.systemPrompt,
      });
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Failed to save settings. ");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">General Settings</h3>
          <p className="text-muted-foreground text-sm">
            Configure the general settings for the extension
          </p>
        </div>

        <FormField
          control={form.control}
          name="activeProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Provider</FormLabel>
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
                  {Object.entries(settings.providers)
                    .filter(([_, provider]) => provider.available)
                    .map(([id]) => (
                      <SelectItem key={id} value={id}>
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
                  className="min-h-[200px]"
                  {...field}
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