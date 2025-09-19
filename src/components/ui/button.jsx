import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  default:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] hover:opacity-90",
  secondary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--accent))]",
  outline:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md border border-[hsl(var(--border))] bg-transparent text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]",
  ghost:
    "inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
}

export const Button = React.forwardRef(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    return (
      <Comp
        className={cn(
          buttonVariants[variant] || buttonVariants.default,
          "h-10 px-4 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"


