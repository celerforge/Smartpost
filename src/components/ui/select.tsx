"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "sp-flex sp-h-9 sp-w-full sp-items-center sp-justify-between sp-whitespace-nowrap sp-rounded-md sp-border sp-border-input sp-bg-transparent sp-px-3 sp-py-2 sp-text-sm sp-shadow-sm sp-ring-offset-background placeholder:sp-text-muted-foreground focus:sp-outline-none focus:sp-ring-1 focus:sp-ring-ring disabled:sp-cursor-not-allowed disabled:sp-opacity-50 [&>span]:sp-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="sp-h-4 sp-w-4 sp-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "sp-flex sp-cursor-default sp-items-center sp-justify-center sp-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="sp-h-4 sp-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "sp-flex sp-cursor-default sp-items-center sp-justify-center sp-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="sp-h-4 sp-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "sp-relative sp-z-50 sp-max-h-96 sp-min-w-[8rem] sp-overflow-hidden sp-rounded-md sp-border sp-bg-popover sp-text-popover-foreground sp-shadow-md data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=open]:sp-fade-in-0 data-[state=closed]:sp-zoom-out-95 data-[state=open]:sp-zoom-in-95 data-[side=bottom]:sp-slide-in-from-top-2 data-[side=left]:sp-slide-in-from-right-2 data-[side=right]:sp-slide-in-from-left-2 data-[side=top]:sp-slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:sp-translate-y-1 data-[side=left]:sp--translate-x-1 data-[side=right]:sp-translate-x-1 data-[side=top]:sp--translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "sp-p-1",
          position === "popper" &&
            "sp-h-[var(--radix-select-trigger-height)] sp-w-full sp-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("sp-px-2 sp-py-1.5 sp-text-sm sp-font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "sp-relative sp-flex sp-w-full sp-cursor-default sp-select-none sp-items-center sp-rounded-sm sp-py-1.5 sp-pl-2 sp-pr-8 sp-text-sm sp-outline-none focus:sp-bg-accent focus:sp-text-accent-foreground data-[disabled]:sp-pointer-events-none data-[disabled]:sp-opacity-50",
      className
    )}
    {...props}
  >
    <span className="sp-absolute sp-right-2 sp-flex sp-h-3.5 sp-w-3.5 sp-items-center sp-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="sp-h-4 sp-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("sp--mx-1 sp-my-1 sp-h-px sp-bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
