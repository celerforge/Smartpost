"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "sp-peer sp-inline-flex sp-h-5 sp-w-9 sp-shrink-0 sp-cursor-pointer sp-items-center sp-rounded-full sp-border-2 sp-border-transparent sp-shadow-sm sp-transition-colors focus-visible:sp-outline-none focus-visible:sp-ring-2 focus-visible:sp-ring-ring focus-visible:sp-ring-offset-2 focus-visible:sp-ring-offset-background disabled:sp-cursor-not-allowed disabled:sp-opacity-50 data-[state=checked]:sp-bg-primary data-[state=unchecked]:sp-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "sp-pointer-events-none sp-block sp-h-4 sp-w-4 sp-rounded-full sp-bg-background sp-shadow-lg sp-ring-0 sp-transition-transform data-[state=checked]:sp-translate-x-4 data-[state=unchecked]:sp-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
