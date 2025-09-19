import * as React from 'react'
import { LogIn, Lock, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

export function Login({ onSubmit }) {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
      <Card className="w-full max-w-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-white/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <LogIn className="h-5 w-5" />
            <span className="text-xs tracking-widest uppercase">Welcome back</span>
          </div>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Use username and password to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit({ username, password }) }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input id="username" type="text" placeholder="admin" className="pl-9" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <Input id="password" type="password" placeholder="admin" className="pl-9" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-[hsl(var(--foreground))] underline underline-offset-4">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
            Hint: use <span className="font-semibold">admin / admin</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


