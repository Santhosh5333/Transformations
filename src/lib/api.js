const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5001'

export async function loginRequest({ username, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.message || 'Login failed'
    throw new Error(message)
  }
  return data
}

export async function verifyRequest(token) {
  const res = await fetch(`${API_BASE}/api/auth/verify`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { valid: false }
  return data
}

export async function testDbConnection(payload, token) {
  const res = await fetch(`${API_BASE}/api/db/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, message: data?.message || 'Connection failed' }
  }
  return data
}

export async function fetchSchemas(conn, token) {
  const res = await fetch(`${API_BASE}/api/db/schemas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(conn)
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false, schemas: [], message: data?.message }
  return data
}

export async function fetchTables(conn, schema, token) {
  const res = await fetch(`${API_BASE}/api/db/tables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ ...conn, schema })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false, tables: [], message: data?.message }
  return data
}

export async function initTransform(transformConn, tempSchema = 'tmp_transform', tempTable = 'temp_table', token) {
  const res = await fetch(`${API_BASE}/api/transform/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, tempSchema, tempTable })
  })
  return await res.json().catch(() => ({}))
}

export async function validateQuery(transformConn, sql, token) {
  const res = await fetch(`${API_BASE}/api/transform/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, sql })
  })
  return await res.json().catch(() => ({}))
}

export async function executeQuery(transformConn, sql, tempSchema = 'tmp_transform', tempTable = 'temp_table', token) {
  const res = await fetch(`${API_BASE}/api/transform/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, sql, tempSchema, tempTable })
  })
  return await res.json().catch(() => ({}))
}

export async function fetchOutput(transformConn, tempSchema = 'tmp_transform', tempTable = 'temp_table', limit = 100, token) {
  const res = await fetch(`${API_BASE}/api/transform/output`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, tempSchema, tempTable, limit })
  })
  return await res.json().catch(() => ({}))
}

export async function seedSelected(transformConn, schema, tables, tempSchema = 'tmp_transform', token) {
  const res = await fetch(`${API_BASE}/api/transform/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, schema, tables, tempSchema })
  })
  return await res.json().catch(() => ({}))
}

export async function loadSelected(sourceConn, transformConn, schema, tables, targetSchema = 'transformations', token) {
  const res = await fetch(`${API_BASE}/api/transform/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ sourceConn, transformConn, schema, tables, targetSchema })
  })
  return await res.json().catch(() => ({}))
}

export async function listTransformTables(transformConn, targetSchema = 'transformations', token) {
  const res = await fetch(`${API_BASE}/api/transform/list-tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, targetSchema })
  })
  return await res.json().catch(() => ({}))
}

export async function listTransformColumns(transformConn, table, targetSchema = 'transformations', token) {
  const res = await fetch(`${API_BASE}/api/transform/columns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, table, targetSchema })
  })
  return await res.json().catch(() => ({}))
}

export async function publishToTarget(transformConn, targetConn, tempSchema = 'tmp_transform', tempTable = 'temp_table', targetSchema = 'public', targetTable = 'transformation_output', token) {
  const res = await fetch(`${API_BASE}/api/transform/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ transformConn, targetConn, tempSchema, tempTable, targetSchema, targetTable })
  })
  return await res.json().catch(() => ({}))
}


