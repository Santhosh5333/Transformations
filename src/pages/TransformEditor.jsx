import * as React from 'react'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { validateQuery, executeQuery, fetchOutput, listTransformTables, listTransformColumns, publishToTarget } from '../lib/api'
import { ArrowLeft } from 'lucide-react'

export function TransformEditor() {
  const token = localStorage.getItem('token')
  const transformConn = JSON.parse(localStorage.getItem('db_transformation_config') || 'null')
  const tempSchema = 'tmp_transform'
  const tempTable = 'temp_table'
  const [sqlEditors, setSqlEditors] = React.useState([{ id: 1, sql: `select * from ${tempSchema}.${tempTable} limit 100`, executedOk: false }])
  const [viewOpen, setViewOpen] = React.useState(false)
  const [output, setOutput] = React.useState({ columns: [], rows: [] })
  const [tables, setTables] = React.useState([])
  const [chosenTable, setChosenTable] = React.useState('')
  const [columns, setColumns] = React.useState([])

  React.useEffect(() => {
    let mounted = true
    async function loadTables() {
      const res = await listTransformTables(transformConn, 'transformations', token)
      if (!mounted) return
      if (res.ok) setTables(res.tables || [])
    }
    loadTables()
    return () => { mounted = false }
  }, [])

  return (
    <section className="px-8 py-10">
      <div className="mb-4">
        <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { to: 'transformations' } }))} aria-label="Back to New Transformation">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <h2 className="text-2xl font-semibold">Transformation Editor</h2>
      <p className="mt-1 text-[hsl(var(--muted-foreground))]">Write SQL against the temp table; each step replaces the temp table.</p>

      <div className="mt-4 max-w-3xl">
        <label className="mb-1 block text-sm font-medium">Tables in transformations schema</label>
        <select
          className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm"
          value={chosenTable}
          onChange={async (e) => {
            const t = e.target.value
            setChosenTable(t)
            const res = await listTransformColumns(transformConn, t, 'transformations', token)
            if (res.ok) setColumns(res.columns || [])
          }}
        >
          <option value="">Select a table</option>
          {tables.map(t => (<option key={t} value={t}>{t}</option>))}
        </select>
        {!!chosenTable && (
          <div className="mt-2 rounded-md border border-[hsl(var(--border))] p-3 text-sm">
            <div className="font-medium">Columns</div>
            <div className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {columns.map(([name, dtype]) => (
                <div key={name} className="flex items-center justify-between">
                  <span>{name}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">{dtype}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sqlEditors.map((ed, idx) => (
        <div key={ed.id} className="mt-8 max-w-3xl">
          <label className="mb-1 block text-sm font-medium">SQL Query {idx + 1}</label>
          <textarea
            className="w-full min-h-[140px] rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm font-mono"
            value={ed.sql}
            onChange={e => {
              const copy = [...sqlEditors]
              copy[idx] = { ...copy[idx], sql: e.target.value }
              setSqlEditors(copy)
            }}
          />
          <div className="mt-2 flex gap-2">
            <Button variant="outline" onClick={async () => {
              const res = await validateQuery(transformConn, ed.sql, token)
              if (res.ok) alert('SQL looks valid')
              else alert(res.message || 'Invalid SQL')
            }}>Check query</Button>
            <Button onClick={async () => {
              const res = await executeQuery(transformConn, ed.sql, tempSchema, tempTable, token)
              if (!res.ok) { alert(res.message || 'Execution failed'); return }
              const out = await fetchOutput(transformConn, tempSchema, tempTable, 100, token)
              if (out.ok) {
                setOutput({ columns: out.columns, rows: out.rows })
                const copy = [...sqlEditors]
                copy[idx] = { ...copy[idx], executedOk: true }
                setSqlEditors(copy)
              } else {
                alert(out.message || 'Failed to fetch output')
              }
            }}>Execute</Button>
          </div>
          {ed.executedOk && (
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <Button variant="outline" onClick={() => setViewOpen(true)}>View output</Button>
              <Button variant="outline" onClick={async () => {
                const targetConn = JSON.parse(localStorage.getItem('db_target_config') || 'null')
                const res = await publishToTarget(transformConn, targetConn, tempSchema, tempTable, 'public', 'transformation_output', token)
                if (res.ok) alert(`Loaded into ${res.targetSchema}.${res.targetTable}`)
                else alert(res.message || 'Failed to load into target')
              }}>Load data to target database</Button>
              {idx === sqlEditors.length - 1 && (
                <Button variant="outline" onClick={() => setSqlEditors(prev => [...prev, { id: prev.length + 1, sql: `select * from ${tempSchema}.${tempTable} limit 100`, executedOk: false }])}>+ Add step</Button>
              )}
            </div>
          )}
        </div>
      ))}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogHeader>
          <DialogTitle>Query Output</DialogTitle>
          <DialogDescription>First 100 rows from temp table</DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {output.columns.map(c => (<th key={c} className="border-b border-[hsl(var(--border))] p-2 text-left font-medium">{c}</th>))}
                </tr>
              </thead>
              <tbody>
                {output.rows.map((r, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--border))]">
                    {output.columns.map(c => (<td key={c} className="p-2 align-top">{String(r[c])}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
        </DialogFooter>
      </Dialog>
    </section>
  )
}


