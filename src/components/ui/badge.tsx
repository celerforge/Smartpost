import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "sp-inline-flex sp-items-center sp-rounded-md sp-border sp-px-2.5 sp-py-0.5 sp-text-xs sp-font-semibold sp-transition-colors focus:sp-outline-none focus:sp-ring-2 focus:sp-ring-ring focus:sp-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "sp-border-transparent sp-bg-primary sp-text-primary-foreground sp-shadow hover:sp-bg-primary/80",
        secondary:
          "sp-border-transparent sp-bg-secondary sp-text-secondary-foreground hover:sp-bg-secondary/80",
        destructive:
          "sp-border-transparent sp-bg-destructive sp-text-destructive-foreground sp-shadow hover:sp-bg-destructive/80",
        outline: "sp-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
