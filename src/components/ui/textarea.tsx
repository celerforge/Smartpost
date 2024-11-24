import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "sp-flex sp-min-h-[60px] sp-w-full sp-rounded-md sp-border sp-border-input sp-bg-transparent sp-px-3 sp-py-2 sp-text-base sp-shadow-sm placeholder:sp-text-muted-foreground focus-visible:sp-outline-none focus-visible:sp-ring-1 focus-visible:sp-ring-ring disabled:sp-cursor-not-allowed disabled:sp-opacity-50 md:sp-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
