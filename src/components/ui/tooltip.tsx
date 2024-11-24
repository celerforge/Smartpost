"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "sp-z-50 sp-overflow-hidden sp-rounded-md sp-bg-primary sp-px-3 sp-py-1.5 sp-text-xs sp-text-primary-foreground sp-animate-in sp-fade-in-0 sp-zoom-in-95 data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=closed]:sp-zoom-out-95 data-[side=bottom]:sp-slide-in-from-top-2 data-[side=left]:sp-slide-in-from-right-2 data-[side=right]:sp-slide-in-from-left-2 data-[side=top]:sp-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
