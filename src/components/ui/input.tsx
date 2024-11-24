import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "sp-flex sp-h-9 sp-w-full sp-rounded-md sp-border sp-border-input sp-bg-transparent sp-px-3 sp-py-1 sp-text-base sp-shadow-sm sp-transition-colors file:sp-border-0 file:sp-bg-transparent file:sp-text-sm file:sp-font-medium file:sp-text-foreground placeholder:sp-text-muted-foreground focus-visible:sp-outline-none focus-visible:sp-ring-1 focus-visible:sp-ring-ring disabled:sp-cursor-not-allowed disabled:sp-opacity-50 md:sp-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
