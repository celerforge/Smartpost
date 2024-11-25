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
import { Textarea } from "@/components/ui/textarea";
import { useStorage } from "@/contexts/storage-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prompt: z.string().min(1, "Prompt is required"),
});

type FormValues = z.infer<typeof formSchema>;

function AddToolDialog({
  open,
  onOpenChange,
  editingTool,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTool?: { id: string; name: string; prompt: string };
}) {
  const { addTool, updateTool } = useStorage();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingTool?.name || "",
      prompt: editingTool?.prompt || "",
    },
  });

  useEffect(() => {
    if (editingTool) {
      form.reset({
        name: editingTool.name,
        prompt: editingTool.prompt,
      });
    }
  }, [editingTool, form]);

  const onSubmit = (values: Required<FormValues>) => {
    if (editingTool) {
      updateTool("x", editingTool.id, values);
    } else {
      addTool("x", values);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tool</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="sp-space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tool name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter prompt template..."
                      className="sp-h-32"
                      {...field}
                    />
                  </FormControl>
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
              <Button type="submit">Add Tool</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function XTools() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<
    { id: string; name: string; prompt: string } | undefined
  >();
  const { storage, deleteTool } = useStorage();
  const tools = storage.tools.x;

  return (
    <div className="sp-space-y-6">
      <div className="sp-flex sp-justify-between sp-items-center">
        <div>
          <h3 className="sp-text-lg sp-font-medium">X (Twitter) Tools</h3>
          <p className="sp-text-muted-foreground sp-text-sm">
            Create AI tools to generate tweets or process content with custom
            prompts. Use {"{post}"} in your prompt to reference the current
            post.
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>Add Tool</Button>
      </div>

      <div className="sp-grid sp-gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="sp-flex sp-items-center sp-justify-between sp-rounded-lg sp-border sp-p-4"
          >
            <div className="sp-flex sp-items-center sp-space-x-4">
              <div className="sp-space-y-1">
                <h4 className="sp-text-base">{tool.name}</h4>
                <p className="sp-text-secondary-foreground sp-text-sm">
                  {tool.prompt}
                </p>
              </div>
            </div>
            <div className="sp-flex sp-gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingTool(tool);
                  setAddDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="sp-text-red-600"
                onClick={() => deleteTool("x", tool.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AddToolDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingTool(undefined);
        }}
        editingTool={editingTool}
      />
    </div>
  );
}
