"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "sp-fixed sp-inset-0 sp-z-50 sp-bg-black/80 sp- data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=open]:sp-fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "sp-fixed sp-z-50 sp-gap-4 sp-bg-background sp-p-6 sp-shadow-lg sp-transition sp-ease-in-out data-[state=closed]:sp-duration-300 data-[state=open]:sp-duration-500 data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out",
  {
    variants: {
      side: {
        top: "sp-inset-x-0 sp-top-0 sp-border-b data-[state=closed]:sp-slide-out-to-top data-[state=open]:sp-slide-in-from-top",
        bottom:
          "sp-inset-x-0 sp-bottom-0 sp-border-t data-[state=closed]:sp-slide-out-to-bottom data-[state=open]:sp-slide-in-from-bottom",
        left: "sp-inset-y-0 sp-left-0 sp-h-full sp-w-3/4 sp-border-r data-[state=closed]:sp-slide-out-to-left data-[state=open]:sp-slide-in-from-left sm:sp-max-w-sm",
        right:
          "sp-inset-y-0 sp-right-0 sp-h-full sp-w-3/4 sp-border-l data-[state=closed]:sp-slide-out-to-right data-[state=open]:sp-slide-in-from-right sm:sp-max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close className="sp-absolute sp-right-4 sp-top-4 sp-rounded-sm sp-opacity-70 sp-ring-offset-background sp-transition-opacity hover:sp-opacity-100 focus:sp-outline-none focus:sp-ring-2 focus:sp-ring-ring focus:sp-ring-offset-2 disabled:sp-pointer-events-none data-[state=open]:sp-bg-secondary">
        <X className="sp-h-4 sp-w-4" />
        <span className="sp-sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sp-flex sp-flex-col sp-space-y-2 sp-text-center sm:sp-text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sp-flex sp-flex-col-reverse sm:sp-flex-row sm:sp-justify-end sm:sp-space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("sp-text-lg sp-font-semibold sp-text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("sp-text-sm sp-text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
