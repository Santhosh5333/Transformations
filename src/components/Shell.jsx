import * as React from 'react'
import { Sidebar } from './Sidebar'

export function Shell({ user, onLogout, activeTab, setActiveTab, children }) {
  const [expanded, setExpanded] = React.useState(true)
  const username = user?.username || 'User'
  const role = user?.role || 'Member'

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[hsl(var(--secondary))] to-transparent">
      <Sidebar expanded={expanded} onToggle={() => setExpanded(v => !v)} activeTab={activeTab} setActiveTab={setActiveTab} username={username} role={role} onLogout={onLogout} />
      <main className="flex-1">
        <header className="flex items-center justify-between px-8 py-6 border-b border-[hsl(var(--border))] backdrop-blur bg-white/40 dark:bg-black/20">
          <h1 className="text-xl font-semibold">Welcome, {username}</h1>
          <div className="hidden md:flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"></div>
        </header>
        {children}
      </main>
    </div>
  )
}


