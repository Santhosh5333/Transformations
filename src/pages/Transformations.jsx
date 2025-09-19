import * as React from 'react'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { fetchSchemas, fetchTables, initTransform, seedSelected, loadSelected, listTransformTables } from '../lib/api'
import { ArrowLeft } from 'lucide-react'

export function TransformationsPage() {
  const token = localStorage.getItem('token')
  const [creating, setCreating] = React.useState(true)
  const [loadingSchemas, setLoadingSchemas] = React.useState(false)
  const [schemas, setSchemas] = React.useState([])
  const [schema, setSchema] = React.useState('')
  const [tables, setTables] = React.useState([])
  const [selectedTables, setSelectedTables] = React.useState([])
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const transformConn = JSON.parse(localStorage.getItem('db_transformation_config') || 'null')
  const [existingCount, setExistingCount] = React.useState(0)
  const tempSchema = 'tmp_transform'
  const tempTable = 'temp_table'

  async function startNewTransformation() {
    const sourceCfg = JSON.parse(localStorage.getItem('db_source_config') || 'null')
    const targetCfg = JSON.parse(localStorage.getItem('db_target_config') || 'null')
    const transformCfg = JSON.parse(localStorage.getItem('db_transformation_config') || 'null')
    if (!sourceCfg) { setError('Please connect source db'); return }
    if (!targetCfg) { setError('Please connect target db'); return }
    if (!transformCfg) { setError('Please connect transformation db'); return }
    setCreating(true)
    setLoadingSchemas(true)
    setError('')
    await initTransform(transformCfg, tempSchema, tempTable, token)
    const res = await fetchSchemas(sourceCfg, token)
    if (res.ok) setSchemas(res.schemas || [])
    else setError(res.message || 'Failed to load schemas')
    setLoadingSchemas(false)
  }

  React.useEffect(() => {
    // auto-start the flow when opening the page
    startNewTransformation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    let mounted = true
    async function checkExisting() {
      if (!transformConn) return
      const res = await listTransformTables(transformConn, 'transformations', token)
      if (mounted && res?.ok) setExistingCount((res.tables || []).length)
    }
    checkExisting()
    return () => { mounted = false }
  }, [transformConn])

  async function onSelectSchema(s) {
    const sourceCfg = JSON.parse(localStorage.getItem('db_source_config') || 'null')
    setSchema(s)
    setSelectedTables([])
    setTables([])
    const res = await fetchTables(sourceCfg, s, token)
    if (res.ok) setTables(res.tables || [])
    else setError(res.message || 'Failed to load tables')
  }

  // Always show the creation flow on this page

  return (
    <section className="px-8 py-10">
      <div className="mb-4">
        <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { to: 'home' } }))} aria-label="Back to Home">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <h2 className="text-2xl font-semibold">New Transformation</h2>
      <p className="mt-1 text-[hsl(var(--muted-foreground))]">Select a schema from your source database, then choose tables.</p>
      {error && (<p className="mt-3 text-sm text-red-600">{error}</p>)}
      <div className="mt-6 max-w-xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schema">Schema</Label>
          <select id="schema" disabled={loadingSchemas} className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm" value={schema} onChange={e => onSelectSchema(e.target.value)}>
            <option value="" disabled>{loadingSchemas ? 'Loading...' : 'Select schema'}</option>
            {schemas.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {!!schema && (
          <div className="space-y-2">
            <Label>Tables</Label>
            <div className="rounded-md border border-[hsl(var(--border))] p-3">
              <div className="grid sm:grid-cols-2 gap-2">
                {tables.map(t => {
                  const checked = selectedTables.includes(t)
                  return (
                    <label key={t} className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={checked} onChange={(e) => {
                        if (e.target.checked) setSelectedTables(prev => [...prev, t])
                        else setSelectedTables(prev => prev.filter(x => x !== t))
                      }} />
                      <span>{t}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <Button disabled={!schema || selectedTables.length === 0 || loading} onClick={async () => {
            setLoading(true)
            const sourceConn = JSON.parse(localStorage.getItem('db_source_config') || 'null')
            const resSeed = await seedSelected(transformConn, schema, selectedTables, tempSchema, token)
            if (!resSeed.ok) { alert(resSeed.message || 'Failed to save selection'); return }
            const resLoad = await loadSelected(sourceConn, transformConn, schema, selectedTables, 'transformations', token)
            if (!resLoad.ok) { alert(resLoad.message || 'Failed to load tables'); setLoading(false); return }
            setLoading(false)
            window.dispatchEvent(new CustomEvent('navigate', { detail: { to: 'transform-editor' } }))
          }}>{loading ? 'Loading…' : 'Load data'}</Button>
          {existingCount > 0 && (
            <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { to: 'transform-editor' } }))}>
              Transform on existing tables
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}


