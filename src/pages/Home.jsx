import * as React from 'react'
import { Button } from '../components/ui/button'

export function HomePage({ goToTransformations, goToSources }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_10%,rgba(0,0,0,0.06),transparent),radial-gradient(600px_200px_at_80%_0%,rgba(0,0,0,0.06),transparent)]" />
      <div className="relative px-8 py-14">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Build, monitor and scale your data transformations</h2>
          <p className="mt-3 text-[hsl(var(--muted-foreground))]">Manage sources, orchestrate transformations, and trace logs—all from one sleek dashboard.</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => {
              const hasSource = !!localStorage.getItem('db_source_config')
              const hasTarget = !!localStorage.getItem('db_target_config')
              const hasTransform = !!localStorage.getItem('db_transformation_config')
              if (!hasSource) { alert('Please connect source db'); goToSources(); return }
              if (!hasTarget) { alert('Please connect target db'); goToSources(); return }
              if (!hasTransform) { alert('Please connect transformation db'); goToSources(); return }
              goToTransformations()
            }}>New Transformation</Button>
          </div>
        </div>
      </div>
    </section>
  )
}


