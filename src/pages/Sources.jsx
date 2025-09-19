import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import { testDbConnection } from '../lib/api'

export function SourcesPage() {
  const [showSourceModal, setShowSourceModal] = React.useState(false)
  const [showTargetModal, setShowTargetModal] = React.useState(false)
  const [showTransformModal, setShowTransformModal] = React.useState(false)
  const [form, setForm] = React.useState({ host: '', port: '5432', database: '', user: '', password: '', sslmode: 'prefer' })
  const [testing, setTesting] = React.useState(false)
  const [testMsg, setTestMsg] = React.useState('')
  const [sourceConnected, setSourceConnected] = React.useState(!!localStorage.getItem('db_source_config'))
  const [targetConnected, setTargetConnected] = React.useState(!!localStorage.getItem('db_target_config'))
  const [transformConnected, setTransformConnected] = React.useState(!!localStorage.getItem('db_transformation_config'))
  const [toast, setToast] = React.useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <section className="px-8 py-10">
      <h2 className="text-2xl font-semibold">Sources</h2>
      <p className="mt-1 text-[hsl(var(--muted-foreground))]">Configure your source and target databases.</p>
      {(sourceConnected || targetConnected || transformConnected) && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className={cn('px-2 py-1 rounded border', sourceConnected ? 'border-green-400 text-green-700' : 'border-[hsl(var(--border))]')}>Source: {sourceConnected ? 'Connected' : 'Not connected'}</span>
          <span className={cn('px-2 py-1 rounded border', targetConnected ? 'border-green-400 text-green-700' : 'border-[hsl(var(--border))]')}>Target: {targetConnected ? 'Connected' : 'Not connected'}</span>
          <span className={cn('px-2 py-1 rounded border', transformConnected ? 'border-green-400 text-green-700' : 'border-[hsl(var(--border))]')}>Transformation: {transformConnected ? 'Connected' : 'Not connected'}</span>
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Configure source database</CardTitle>
            <CardDescription>Connect to the database that provides your data.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => { setForm({ host: '', port: '5432', database: '', user: '', password: '', sslmode: 'prefer' }); setTestMsg(''); setShowSourceModal(true) }}>Configure</Button>
            {sourceConnected && (
              <Button variant="outline" onClick={() => { localStorage.removeItem('db_source_config'); setSourceConnected(false); showToast('Source disconnected') }}>Disconnect</Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Configure target database</CardTitle>
            <CardDescription>Connect to the destination database for transformations.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => { setForm({ host: '', port: '5432', database: '', user: '', password: '', sslmode: 'prefer' }); setTestMsg(''); setShowTargetModal(true) }}>Configure</Button>
            {targetConnected && (
              <Button variant="outline" onClick={() => { localStorage.removeItem('db_target_config'); setTargetConnected(false); showToast('Target disconnected') }}>Disconnect</Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Configure transformation database</CardTitle>
            <CardDescription>Connect to the working database for transformations.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => { setForm({ host: '', port: '5432', database: '', user: '', password: '', sslmode: 'prefer' }); setTestMsg(''); setShowTransformModal(true) }}>Configure</Button>
            {transformConnected && (
              <Button variant="outline" onClick={() => { localStorage.removeItem('db_transformation_config'); setTransformConnected(false); showToast('Transformation disconnected') }}>Disconnect</Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSourceModal} onOpenChange={setShowSourceModal}>
        <DialogHeader>
          <DialogTitle>Source database</DialogTitle>
          <DialogDescription>Enter connection details for your source database.</DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="source-host">Host</Label>
              <Input id="source-host" placeholder="localhost" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="source-port">Port</Label>
              <Input id="source-port" placeholder="5432" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="source-db">Database</Label>
              <Input id="source-db" placeholder="postgres" value={form.database} onChange={e => setForm({ ...form, database: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="source-user">User</Label>
              <Input id="source-user" placeholder="postgres" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="source-pass">Password</Label>
              <Input id="source-pass" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="source-ssl">SSL mode</Label>
              <Input id="source-ssl" placeholder="disable | prefer | require" value={form.sslmode} onChange={e => setForm({ ...form, sslmode: e.target.value })} />
            </div>
          </div>
          {testMsg && (<p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{testMsg}</p>)}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSourceModal(false)}>Cancel</Button>
          <Button variant="outline" disabled={testing} onClick={async () => {
            setTesting(true)
            const token = localStorage.getItem('token')
            const res = await testDbConnection({ ...form, type: 'source' }, token)
            setTestMsg(res.ok ? `Success: ${res.message} (${res.latencyMs ?? '?'}ms)` : `Failed: ${res.message}`)
            setTesting(false)
          }}>Test connection</Button>
          <Button disabled={testing} onClick={() => { localStorage.setItem('db_source_config', JSON.stringify(form)); setShowSourceModal(false); setSourceConnected(true); setTestMsg(''); showToast('Source database connected') }}>Connect</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showTargetModal} onOpenChange={setShowTargetModal}>
        <DialogHeader>
          <DialogTitle>Target database</DialogTitle>
          <DialogDescription>Enter connection details for your target database.</DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="target-host">Host</Label>
              <Input id="target-host" placeholder="localhost" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="target-port">Port</Label>
              <Input id="target-port" placeholder="5432" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="target-db">Database</Label>
              <Input id="target-db" placeholder="analytics_db" value={form.database} onChange={e => setForm({ ...form, database: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="target-user">User</Label>
              <Input id="target-user" placeholder="postgres" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="target-pass">Password</Label>
              <Input id="target-pass" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="target-ssl">SSL mode</Label>
              <Input id="target-ssl" placeholder="disable | prefer | require" value={form.sslmode} onChange={e => setForm({ ...form, sslmode: e.target.value })} />
            </div>
          </div>
          {testMsg && (<p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{testMsg}</p>)}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowTargetModal(false)}>Cancel</Button>
          <Button variant="outline" disabled={testing} onClick={async () => {
            setTesting(true)
            const token = localStorage.getItem('token')
            const res = await testDbConnection({ ...form, type: 'target' }, token)
            setTestMsg(res.ok ? `Success: ${res.message} (${res.latencyMs ?? '?'}ms)` : `Failed: ${res.message}`)
            setTesting(false)
          }}>Test connection</Button>
          <Button disabled={testing} onClick={() => { localStorage.setItem('db_target_config', JSON.stringify(form)); setShowTargetModal(false); setTargetConnected(true); setTestMsg(''); showToast('Target database connected') }}>Connect</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showTransformModal} onOpenChange={setShowTransformModal}>
        <DialogHeader>
          <DialogTitle>Transformation database</DialogTitle>
          <DialogDescription>Enter connection details for your transformation database.</DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="transform-host">Host</Label>
              <Input id="transform-host" placeholder="localhost" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="transform-port">Port</Label>
              <Input id="transform-port" placeholder="5432" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="transform-db">Database</Label>
              <Input id="transform-db" placeholder="transform_db" value={form.database} onChange={e => setForm({ ...form, database: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="transform-user">User</Label>
              <Input id="transform-user" placeholder="postgres" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="transform-pass">Password</Label>
              <Input id="transform-pass" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="transform-ssl">SSL mode</Label>
              <Input id="transform-ssl" placeholder="disable | prefer | require" value={form.sslmode} onChange={e => setForm({ ...form, sslmode: e.target.value })} />
            </div>
          </div>
          {testMsg && (<p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{testMsg}</p>)}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowTransformModal(false)}>Cancel</Button>
          <Button variant="outline" disabled={testing} onClick={async () => {
            setTesting(true)
            const token = localStorage.getItem('token')
            const res = await testDbConnection({ ...form, type: 'transformation' }, token)
            setTestMsg(res.ok ? `Success: ${res.message} (${res.latencyMs ?? '?'}ms)` : `Failed: ${res.message}`)
            setTesting(false)
          }}>Test connection</Button>
          <Button disabled={testing} onClick={() => { localStorage.setItem('db_transformation_config', JSON.stringify(form)); setShowTransformModal(false); setTransformConnected(true); setTestMsg(''); showToast('Transformation database connected') }}>Connect</Button>
        </DialogFooter>
      </Dialog>

      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm shadow">{toast}</div>
      )}
    </section>
  )
}


