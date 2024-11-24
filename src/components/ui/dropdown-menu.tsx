"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "sp-flex sp-cursor-default sp-gap-2 sp-select-none sp-items-center sp-rounded-sm sp-px-2 sp-py-1.5 sp-text-sm sp-outline-none focus:sp-bg-accent data-[state=open]:sp-bg-accent [&_svg]:sp-pointer-events-none [&_svg]:sp-size-4 [&_svg]:sp-shrink-0",
      inset && "sp-pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="sp-ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "sp-z-50 sp-min-w-[8rem] sp-overflow-hidden sp-rounded-md sp-border sp-bg-popover sp-p-1 sp-text-popover-foreground sp-shadow-lg data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=open]:sp-fade-in-0 data-[state=closed]:sp-zoom-out-95 data-[state=open]:sp-zoom-in-95 data-[side=bottom]:sp-slide-in-from-top-2 data-[side=left]:sp-slide-in-from-right-2 data-[side=right]:sp-slide-in-from-left-2 data-[side=top]:sp-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "sp-z-50 sp-min-w-[8rem] sp-overflow-hidden sp-rounded-md sp-border sp-bg-popover sp-p-1 sp-text-popover-foreground sp-shadow-md",
        "data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=open]:sp-fade-in-0 data-[state=closed]:sp-zoom-out-95 data-[state=open]:sp-zoom-in-95 data-[side=bottom]:sp-slide-in-from-top-2 data-[side=left]:sp-slide-in-from-right-2 data-[side=right]:sp-slide-in-from-left-2 data-[side=top]:sp-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "sp-relative sp-flex sp-cursor-default sp-select-none sp-items-center sp-gap-2 sp-rounded-sm sp-px-2 sp-py-1.5 sp-text-sm sp-outline-none sp-transition-colors focus:sp-bg-accent focus:sp-text-accent-foreground data-[disabled]:sp-pointer-events-none data-[disabled]:sp-opacity-50 [&>svg]:sp-size-4 [&>svg]:sp-shrink-0",
      inset && "sp-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "sp-relative sp-flex sp-cursor-default sp-select-none sp-items-center sp-rounded-sm sp-py-1.5 sp-pl-8 sp-pr-2 sp-text-sm sp-outline-none sp-transition-colors focus:sp-bg-accent focus:sp-text-accent-foreground data-[disabled]:sp-pointer-events-none data-[disabled]:sp-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="sp-absolute sp-left-2 sp-flex sp-h-3.5 sp-w-3.5 sp-items-center sp-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="sp-h-4 sp-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "sp-relative sp-flex sp-cursor-default sp-select-none sp-items-center sp-rounded-sm sp-py-1.5 sp-pl-8 sp-pr-2 sp-text-sm sp-outline-none sp-transition-colors focus:sp-bg-accent focus:sp-text-accent-foreground data-[disabled]:sp-pointer-events-none data-[disabled]:sp-opacity-50",
      className
    )}
    {...props}
  >
    <span className="sp-absolute sp-left-2 sp-flex sp-h-3.5 sp-w-3.5 sp-items-center sp-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="sp-h-2 sp-w-2 sp-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "sp-px-2 sp-py-1.5 sp-text-sm sp-font-semibold",
      inset && "sp-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("sp--mx-1 sp-my-1 sp-h-px sp-bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("sp-ml-auto sp-text-xs sp-tracking-widest sp-opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
