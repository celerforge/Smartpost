"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "sp-fixed sp-inset-0 sp-z-50 sp-bg-black/80 sp- data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=open]:sp-fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "sp-fixed sp-left-[50%] sp-top-[50%] sp-z-50 sp-grid sp-w-full sp-max-w-lg sp-translate-x-[-50%] sp-translate-y-[-50%] sp-gap-4 sp-border sp-bg-background sp-p-6 sp-shadow-lg sp-duration-200 data-[state=open]:sp-animate-in data-[state=closed]:sp-animate-out data-[state=closed]:sp-fade-out-0 data-[state=open]:sp-fade-in-0 data-[state=closed]:sp-zoom-out-95 data-[state=open]:sp-zoom-in-95 data-[state=closed]:sp-slide-out-to-left-1/2 data-[state=closed]:sp-slide-out-to-top-[48%] data-[state=open]:sp-slide-in-from-left-1/2 data-[state=open]:sp-slide-in-from-top-[48%] sm:sp-rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="sp-absolute sp-right-4 sp-top-4 sp-rounded-sm sp-opacity-70 sp-ring-offset-background sp-transition-opacity hover:sp-opacity-100 focus:sp-outline-none focus:sp-ring-2 focus:sp-ring-ring focus:sp-ring-offset-2 disabled:sp-pointer-events-none data-[state=open]:sp-bg-accent data-[state=open]:sp-text-muted-foreground">
        <X className="sp-h-4 sp-w-4" />
        <span className="sp-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sp-flex sp-flex-col sp-space-y-1.5 sp-text-center sm:sp-text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "sp-text-lg sp-font-semibold sp-leading-none sp-tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("sp-text-sm sp-text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
