import * as React from 'react'
import { ChevronLeft, ChevronRight, Database, FileText, Layers, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

function SidebarButton({ icon: Icon, label, expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className={cn('transition-opacity', expanded ? 'opacity-100' : 'opacity-0 pointer-events-none')}>{label}</span>
    </button>
  )
}

export function Sidebar({ expanded, onToggle, activeTab, setActiveTab, username, role, onLogout }) {
  return (
    <aside className={cn(
      'group relative h-screen border-r border-[hsl(var(--border))] bg-white/70 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/50 transition-[width] duration-300',
      expanded ? 'w-64' : 'w-20'
    )}>
      <button
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow hover:shadow-md"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {expanded ? <ChevronLeft className="h-4 w-4 mx-auto" /> : <ChevronRight className="h-4 w-4 mx-auto" />}
      </button>
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] grid place-items-center text-xs font-bold">TR</div>
          <span className={cn('text-base font-semibold', expanded ? 'block' : 'hidden')}>Transformations</span>
        </div>
      </div>
      <nav className="px-2 py-2 space-y-1">
        <SidebarButton icon={Layers} label="Transformations" expanded={expanded} onClick={() => setActiveTab('home')} />
        <SidebarButton icon={Database} label="Sources" expanded={expanded} onClick={() => setActiveTab('sources')} />
        <SidebarButton icon={FileText} label="Logs" expanded={expanded} onClick={() => setActiveTab('logs')} />
      </nav>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[hsl(var(--accent))]">
          <div className="h-9 w-9 rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] grid place-items-center text-sm font-semibold">A</div>
          <div className={cn('min-w-0', expanded ? 'block' : 'hidden')}>
            <p className="truncate text-sm font-medium">{username}</p>
            <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">{role}</p>
          </div>
        </div>
        <Button variant="outline" className={cn('mt-3 w-full', expanded ? 'block' : 'hidden')} onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        <button className={cn('mt-3 w-10 h-10 grid place-items-center rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]', expanded ? 'hidden' : 'grid')} onClick={onLogout}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}


