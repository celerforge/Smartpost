import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("sp-animate-pulse sp-rounded-md sp-bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
