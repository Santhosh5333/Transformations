import * as React from "react"
import { cn } from "../../lib/utils"

export function Dialog({ open, onOpenChange, children }) {
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onOpenChange?.(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange?.(false)} />
      <div className={cn("relative z-10 w-full max-w-lg rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-lg")}>{children}</div>
    </div>
  )
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("p-6 pb-3", className)} {...props} />
}

export function DialogTitle({ className, ...props }) {
  return <h3 className={cn("text-xl font-semibold", className)} {...props} />
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-[hsl(var(--muted-foreground))]", className)} {...props} />
}

export function DialogContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn("flex justify-end gap-3 p-6 pt-0", className)} {...props} />
}


