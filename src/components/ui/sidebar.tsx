"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "sp-group/sidebar-wrapper sp-flex sp-min-h-svh sp-w-full has-[[data-variant=inset]]:sp-bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "sp-flex sp-h-full sp-w-[--sidebar-width] sp-flex-col sp-bg-sidebar sp-text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="sp-w-[--sidebar-width] sp-bg-sidebar sp-p-0 sp-text-sidebar-foreground [&>button]:sp-hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="sp-flex sp-h-full sp-w-full sp-flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="sp-group sp-peer sp-hidden md:sp-block sp-text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "sp-duration-200 sp-relative sp-h-svh sp-w-[--sidebar-width] sp-bg-transparent sp-transition-[width] sp-ease-linear",
            "group-data-[collapsible=offcanvas]:sp-w-0",
            "group-data-[side=right]:sp-rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:sp-w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:sp-w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "sp-duration-200 sp-fixed sp-inset-y-0 sp-z-10 sp-hidden sp-h-svh sp-w-[--sidebar-width] sp-transition-[left,right,width] sp-ease-linear md:sp-flex",
            side === "left"
              ? "sp-left-0 group-data-[collapsible=offcanvas]:sp-left-[calc(var(--sidebar-width)*-1)]"
              : "sp-right-0 group-data-[collapsible=offcanvas]:sp-right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "sp-p-2 group-data-[collapsible=icon]:sp-w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:sp-w-[--sidebar-width-icon] group-data-[side=left]:sp-border-r group-data-[side=right]:sp-border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="sp-flex sp-h-full sp-w-full sp-flex-col sp-bg-sidebar group-data-[variant=floating]:sp-rounded-lg group-data-[variant=floating]:sp-border group-data-[variant=floating]:sp-border-sidebar-border group-data-[variant=floating]:sp-shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("sp-h-7 sp-w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sp-sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "sp-absolute sp-inset-y-0 sp-z-20 sp-hidden sp-w-4 sp--translate-x-1/2 sp-transition-all sp-ease-linear after:sp-absolute after:sp-inset-y-0 after:sp-left-1/2 after:sp-w-[2px] hover:after:sp-bg-sidebar-border group-data-[side=left]:sp--right-4 group-data-[side=right]:sp-left-0 sm:sp-flex",
        "[[data-side=left]_&]:sp-cursor-w-resize [[data-side=right]_&]:sp-cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:sp-cursor-e-resize [[data-side=right][data-state=collapsed]_&]:sp-cursor-w-resize",
        "group-data-[collapsible=offcanvas]:sp-translate-x-0 group-data-[collapsible=offcanvas]:after:sp-left-full group-data-[collapsible=offcanvas]:hover:sp-bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:sp--right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:sp--left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "sp-relative sp-flex sp-min-h-svh sp-flex-1 sp-flex-col sp-bg-background",
        "peer-data-[variant=inset]:sp-min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:sp-m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:sp-ml-2 md:peer-data-[variant=inset]:sp-ml-0 md:peer-data-[variant=inset]:sp-rounded-xl md:peer-data-[variant=inset]:sp-shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "sp-h-8 sp-w-full sp-bg-background sp-shadow-none focus-visible:sp-ring-2 focus-visible:sp-ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("sp-flex sp-flex-col sp-gap-2 sp-p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("sp-flex sp-flex-col sp-gap-2 sp-p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("sp-mx-2 sp-w-auto sp-bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "sp-flex sp-min-h-0 sp-flex-1 sp-flex-col sp-gap-2 sp-overflow-auto group-data-[collapsible=icon]:sp-overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("sp-relative sp-flex sp-w-full sp-min-w-0 sp-flex-col sp-p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "sp-duration-200 sp-flex sp-h-8 sp-shrink-0 sp-items-center sp-rounded-md sp-px-2 sp-text-xs sp-font-medium sp-text-sidebar-foreground/70 sp-outline-none sp-ring-sidebar-ring sp-transition-[margin,opa] sp-ease-linear focus-visible:sp-ring-2 [&>svg]:sp-size-4 [&>svg]:sp-shrink-0",
        "group-data-[collapsible=icon]:sp--mt-8 group-data-[collapsible=icon]:sp-opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "sp-absolute sp-right-3 sp-top-3.5 sp-flex sp-aspect-square sp-w-5 sp-items-center sp-justify-center sp-rounded-md sp-p-0 sp-text-sidebar-foreground sp-outline-none sp-ring-sidebar-ring sp-transition-transform hover:sp-bg-sidebar-accent hover:sp-text-sidebar-accent-foreground focus-visible:sp-ring-2 [&>svg]:sp-size-4 [&>svg]:sp-shrink-0",
        // Increases the hit area of the button on mobile.
        "after:sp-absolute after:sp--inset-2 after:md:sp-hidden",
        "group-data-[collapsible=icon]:sp-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("sp-w-full sp-text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("sp-flex sp-w-full sp-min-w-0 sp-flex-col sp-gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("sp-group/menu-item sp-relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "sp-peer/menu-button sp-flex sp-w-full sp-items-center sp-gap-2 sp-overflow-hidden sp-rounded-md sp-p-2 sp-text-left sp-text-sm sp-outline-none sp-ring-sidebar-ring sp-transition-[width,height,padding] hover:sp-bg-sidebar-accent hover:sp-text-sidebar-accent-foreground focus-visible:sp-ring-2 active:sp-bg-sidebar-accent active:sp-text-sidebar-accent-foreground disabled:sp-pointer-events-none disabled:sp-opacity-50 sp-group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:sp-pointer-events-none aria-disabled:sp-opacity-50 data-[active=true]:sp-bg-sidebar-accent data-[active=true]:sp-font-medium data-[active=true]:sp-text-sidebar-accent-foreground data-[state=open]:hover:sp-bg-sidebar-accent data-[state=open]:hover:sp-text-sidebar-accent-foreground group-data-[collapsible=icon]:sp-!size-8 group-data-[collapsible=icon]:sp-!p-2 [&>span:last-child]:sp-truncate [&>svg]:sp-size-4 [&>svg]:sp-shrink-0",
  {
    variants: {
      variant: {
        default: "hover:sp-bg-sidebar-accent hover:sp-text-sidebar-accent-foreground",
        outline:
          "sp-bg-background sp-shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:sp-bg-sidebar-accent hover:sp-text-sidebar-accent-foreground hover:sp-shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "sp-h-8 sp-text-sm",
        sm: "sp-h-7 sp-text-xs",
        lg: "sp-h-12 sp-text-sm group-data-[collapsible=icon]:sp-!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "sp-absolute sp-right-1 sp-top-1.5 sp-flex sp-aspect-square sp-w-5 sp-items-center sp-justify-center sp-rounded-md sp-p-0 sp-text-sidebar-foreground sp-outline-none sp-ring-sidebar-ring sp-transition-transform hover:sp-bg-sidebar-accent hover:sp-text-sidebar-accent-foreground focus-visible:sp-ring-2 sp-peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:sp-size-4 [&>svg]:sp-shrink-0",
        // Increases the hit area of the button on mobile.
        "after:sp-absolute after:sp--inset-2 after:md:sp-hidden",
        "sp-peer-data-[size=sm]/menu-button:top-1",
        "sp-peer-data-[size=default]/menu-button:top-1.5",
        "sp-peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:sp-hidden",
        showOnHover &&
          "sp-group-focus-within/menu-item:opacity-100 sp-group-hover/menu-item:opacity-100 data-[state=open]:sp-opacity-100 sp-peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:sp-opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "sp-absolute sp-right-1 sp-flex sp-h-5 sp-min-w-5 sp-items-center sp-justify-center sp-rounded-md sp-px-1 sp-text-xs sp-font-medium sp-tabular-nums sp-text-sidebar-foreground sp-select-none sp-pointer-events-none",
      "sp-peer-hover/menu-button:text-sidebar-accent-foreground sp-peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "sp-peer-data-[size=sm]/menu-button:top-1",
      "sp-peer-data-[size=default]/menu-button:top-1.5",
      "sp-peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:sp-hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("sp-rounded-md sp-h-8 sp-flex sp-gap-2 sp-px-2 sp-items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="sp-size-4 sp-rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="sp-h-4 sp-flex-1 sp-max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "sp-mx-3.5 sp-flex sp-min-w-0 sp-translate-x-px sp-flex-col sp-gap-1 sp-border-l sp-border-sidebar-border sp-px-2.5 sp-py-0.5",
      "group-data-[collapsible=icon]:sp-hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "sp-flex sp-h-7 sp-min-w-0 sp--translate-x-px sp-items-center sp-gap-2 sp-overflow-hidden sp-rounded-md sp-px-2 sp-text-sidebar-foreground sp-outline-none sp-ring-sidebar-ring hover:sp-bg-sidebar-accent hover:sp-text-sidebar-accent-foreground focus-visible:sp-ring-2 active:sp-bg-sidebar-accent active:sp-text-sidebar-accent-foreground disabled:sp-pointer-events-none disabled:sp-opacity-50 aria-disabled:sp-pointer-events-none aria-disabled:sp-opacity-50 [&>span:last-child]:sp-truncate [&>svg]:sp-size-4 [&>svg]:sp-shrink-0 [&>svg]:sp-text-sidebar-accent-foreground",
        "data-[active=true]:sp-bg-sidebar-accent data-[active=true]:sp-text-sidebar-accent-foreground",
        size === "sm" && "sp-text-xs",
        size === "md" && "sp-text-sm",
        "group-data-[collapsible=icon]:sp-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
