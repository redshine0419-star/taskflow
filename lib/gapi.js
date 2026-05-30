// Google OAuth (authorization code flow) + Sheets API v4

let _token = null
export const getToken = () => _token
export const setToken = (t) => { _token = t }
export const clearToken = () => { _token = null }

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const REDIRECT_URI = `${BASE_URL}/api/auth/callback`
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file openid email profile'

const SHEET_TITLE = 'Tasks'
const HEADERS = ['id', 'title', 'stage', 'priority', 'assignee', 'dueDate', 'desc', 'published', 'comments']

// ─── SESSION PERSISTENCE (sessionStorage) ────────────────────────────────────
const SESSION_KEY = 'tf_session'

export function saveSession(token, user) {
  const expires = Date.now() + 55 * 60 * 1000 // 55 min (token lasts 60)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, user, expires }))
  setToken(token)
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const { token, user, expires } = JSON.parse(raw)
    if (Date.now() > expires) { sessionStorage.removeItem(SESSION_KEY); return null }
    setToken(token)
    return user
  } catch (e) { void e; return null }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
  clearToken()
}

// ─── START OAUTH REDIRECT FLOW ───────────────────────────────────────────────
export function startOAuthFlow() {
  if (!CLIENT_ID) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'online',
    prompt: 'consent',
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

// ─── PARSE AUTH RESULT FROM URL (called on page load) ────────────────────────
export function parseAuthFromURL() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)

  const authError = params.get('auth_error')
  if (authError) {
    // Clean up URL
    const clean = window.location.pathname
    window.history.replaceState({}, '', clean)
    return { error: decodeURIComponent(authError) }
  }

  const authParam = params.get('auth')
  if (!authParam) return null

  try {
    const data = JSON.parse(decodeURIComponent(authParam))
    const user = { name: data.name, email: data.email, picture: data.picture }
    saveSession(data.token, user)
    window.history.replaceState({}, '', window.location.pathname)
    return { user }
  } catch {
    return { error: 'Failed to parse auth response' }
  }
}

// ─── SHEETS REST HELPERS ──────────────────────────────────────────────────────
async function sheetsRequest(path, method = 'GET', body) {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Sheets API error ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}

async function driveRequest(path, method = 'GET', body) {
  const token = getToken()
  const res = await fetch(`https://www.googleapis.com/drive/v3${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Drive API error ${res.status}`)
  return res.json()
}

// ─── FIND OR CREATE SPREADSHEET ───────────────────────────────────────────────
export async function findOrCreateSpreadsheet() {
  const q = encodeURIComponent("name='TaskFlow_Database' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false")
  const list = await driveRequest(`/files?q=${q}&fields=files(id,name)`)
  if (list.files?.length > 0) return list.files[0].id

  const created = await sheetsRequest('', 'POST', {
    properties: { title: 'TaskFlow_Database' },
    sheets: [{ properties: { title: SHEET_TITLE } }],
  })
  await sheetsRequest(`/${created.spreadsheetId}/values/${SHEET_TITLE}!A1:I1?valueInputOption=RAW`, 'PUT', {
    values: [HEADERS],
  })
  return created.spreadsheetId
}

// ─── TASK SERIALIZATION ───────────────────────────────────────────────────────
function taskToRow(task) {
  return [
    task.id, task.title, task.stage, task.priority,
    task.assignee || '', task.dueDate || '', task.desc || '',
    task.published ? 'true' : 'false',
    JSON.stringify(task.comments || []),
  ]
}

function rowToTask(row, rowNum) {
  if (!row[0]) return null
  return {
    id: Number(row[0]), rowNum,
    title: row[1] || '', stage: row[2] || 'planning', priority: row[3] || 'medium',
    assignee: row[4] || '', dueDate: row[5] || '', desc: row[6] || '',
    published: row[7] === 'true',
    comments: (() => { try { return JSON.parse(row[8] || '[]') } catch (e) { void e; return [] } })(),
  }
}

export async function loadTasks(spreadsheetId) {
  const data = await sheetsRequest(`/${spreadsheetId}/values/${SHEET_TITLE}!A2:I1000`)
  return (data.values || []).map((r, i) => rowToTask(r, i + 2)).filter(Boolean)
}

export async function appendTask(spreadsheetId, task) {
  const res = await sheetsRequest(
    `/${spreadsheetId}/values/${SHEET_TITLE}!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST', { values: [taskToRow(task)] }
  )
  const match = (res.updates?.updatedRange || '').match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

export async function updateTaskRow(spreadsheetId, rowNum, task) {
  await sheetsRequest(
    `/${spreadsheetId}/values/${SHEET_TITLE}!A${rowNum}:I${rowNum}?valueInputOption=RAW`,
    'PUT', { values: [taskToRow(task)] }
  )
}

export async function deleteTaskRow(spreadsheetId, sheetId, rowNum) {
  await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
    requests: [{ deleteDimension: {
      range: { sheetId, dimension: 'ROWS', startIndex: rowNum - 1, endIndex: rowNum },
    }}],
  })
}

export async function getSheetId(spreadsheetId) {
  const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
  const sheet = meta.sheets?.find(s => s.properties.title === SHEET_TITLE)
  return sheet?.properties?.sheetId ?? 0
}
