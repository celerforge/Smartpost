import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "@/content/toolbar-button";
import {
  XDOMError,
  getXPostTextElement,
  updateXPostText,
} from "@/content/x/dom";
import { useStorage, type Tool } from "@/contexts/storage-context";
import { runTool } from "@/lib/ai";
import { EXTENSION_URL } from "@/lib/env";
import { RoutePaths } from "@/options/route";
import { Paintbrush } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function XTools() {
  const { storage } = useStorage();
  const [loading, setLoading] = useState(false);

  async function handleClick(tool: Tool) {
    setLoading(true);

    try {
      const textElement = getXPostTextElement(false);
      const currentText =
        textElement && textElement.tagName !== "BR"
          ? textElement.textContent || ""
          : "";

      const output = await runTool(tool, currentText, storage.settings);
      console.debug(`Tool output: ${output}`);
      updateXPostText(output);
    } catch (error) {
      const message =
        error instanceof XDOMError ? error.message : "Failed to run tool";
      console.error(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          icon={
            <Paintbrush className="sp-relative sp-top-[0.5px] sp-h-[18px] sp-w-[18px]" />
          }
          loading={loading}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {storage.tools.x.length === 0 ? (
          <DropdownMenuItem>
            <span className="sp-text-muted-foreground">No tools yet.</span>{" "}
            <a
              href={`${EXTENSION_URL}/options.html${RoutePaths.TOOLS_X}`}
              className="sp-text-primary sp-underline sp-font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add tools →
            </a>
          </DropdownMenuItem>
        ) : (
          storage.tools.x.map((tool) => (
            <DropdownMenuItem key={tool.id} onClick={() => handleClick(tool)}>
              {tool.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
