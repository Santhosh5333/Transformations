import { useEffect, useState } from 'react'
import { Shell } from './components/Shell'
import { Login } from './components/Login'
import { HomePage } from './pages/Home'
import { SourcesPage } from './pages/Sources'
import { TransformationsPage } from './pages/Transformations'
import { TransformEditor } from './pages/TransformEditor'
import { loginRequest, verifyRequest } from './lib/api'

function App() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setBooting(false)
      return
    }
    ;(async () => {
      const result = await verifyRequest(token)
      if (result?.valid) {
        setUser(result.user)
        setIsAuthed(true)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
      }
      setBooting(false)
    })()
  }, [])

  useEffect(() => {
    function onNavigate(e) {
      const to = e?.detail?.to
      if (to) setActiveTab(to)
    }
    window.addEventListener('navigate', onNavigate)
    return () => window.removeEventListener('navigate', onNavigate)
  }, [])

  async function handleLoginSubmit({ username, password }) {
    try {
      const { token, user } = await loginRequest({ username, password })
      localStorage.setItem('auth', '1')
      localStorage.setItem('token', token)
      setUser(user)
      setIsAuthed(true)
    } catch (err) {
      alert(err.message || 'Login failed')
    }
  }

  function handleLogout() {
    localStorage.removeItem('auth')
    localStorage.removeItem('token')
    setIsAuthed(false)
    setUser(null)
    setActiveTab('home')
  }

  if (booting) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
      </div>
    )
  }

  if (!isAuthed) {
    return <Login onSubmit={handleLoginSubmit} />
  }

  return (
    <Shell user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && (
        <HomePage goToTransformations={() => setActiveTab('transformations')} goToSources={() => setActiveTab('sources')} />
      )}
      {activeTab === 'sources' && (<SourcesPage />)}
      {activeTab === 'transformations' && (<TransformationsPage />)}
      {activeTab === 'transform-editor' && (<TransformEditor />)}
      {activeTab === 'logs' && (
        <section className="px-8 py-10"><h2 className="text-2xl font-semibold">Logs</h2><p className="mt-1 text-[hsl(var(--muted-foreground))]">Coming soon.</p></section>
      )}
    </Shell>
  )
}

export default App


