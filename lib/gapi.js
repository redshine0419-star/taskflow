// Google Identity Services + Sheets API v4 integration

/* global process */
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
const SHEET_TITLE = 'Tasks'
const HEADERS = ['id', 'title', 'stage', 'priority', 'assignee', 'dueDate', 'desc', 'published', 'comments']

// ─── TOKEN STORE (in-memory only) ────────────────────────────────────────────
let _token = null
export const getToken = () => _token
export const setToken = (t) => { _token = t }
export const clearToken = () => { _token = null }

// ─── LOAD GIS SCRIPT ─────────────────────────────────────────────────────────
export function loadGIS() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) return resolve()
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.onload = resolve
    s.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(s)
  })
}

// ─── REQUEST ACCESS TOKEN ─────────────────────────────────────────────────────
export function requestToken() {
  if (!CLIENT_ID) return Promise.reject(new Error('Google Client ID is not configured. Check NEXT_PUBLIC_GOOGLE_CLIENT_ID env variable.'))
  return new Promise((resolve, reject) => {
    let settled = false
    const done = (fn) => { if (!settled) { settled = true; fn() } }

    // 2-minute timeout
    const timer = setTimeout(() => done(() => reject(new Error('Sign-in timed out. Please try again.'))), 120000)

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (res) => {
        console.log('[GIS] callback fired', res)
        clearTimeout(timer)
        if (res.error) return done(() => reject(new Error(res.error_description || res.error)))
        setToken(res.access_token)
        done(() => resolve(res.access_token))
      },
      error_callback: (err) => {
        console.log('[GIS] error_callback fired', err)
        clearTimeout(timer)
        done(() => reject(new Error(err.type === 'popup_closed'
          ? `popup_closed — 동의 없이 팝업이 닫혔습니다 (type: ${err.type})`
          : err.message || 'OAuth error'
        )))
      },
    })
    client.requestAccessToken({ prompt: 'consent' })
  })
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
  // Search for existing TaskFlow spreadsheet
  const q = encodeURIComponent("name='TaskFlow_Database' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false")
  const list = await driveRequest(`/files?q=${q}&fields=files(id,name)`)
  if (list.files?.length > 0) return list.files[0].id

  // Create new spreadsheet
  const created = await sheetsRequest('', 'POST', {
    properties: { title: 'TaskFlow_Database' },
    sheets: [{ properties: { title: SHEET_TITLE } }],
  })

  // Write header row
  await sheetsRequest(`/${created.spreadsheetId}/values/${SHEET_TITLE}!A1:I1?valueInputOption=RAW`, 'PUT', {
    values: [HEADERS],
  })

  return created.spreadsheetId
}

// ─── TASK SERIALIZATION ───────────────────────────────────────────────────────
function taskToRow(task) {
  return [
    task.id,
    task.title,
    task.stage,
    task.priority,
    task.assignee || '',
    task.dueDate || '',
    task.desc || '',
    task.published ? 'true' : 'false',
    JSON.stringify(task.comments || []),
  ]
}

function rowToTask(row, rowNum) {
  if (!row[0]) return null
  return {
    id: Number(row[0]),
    rowNum,
    title:     row[1] || '',
    stage:     row[2] || 'planning',
    priority:  row[3] || 'medium',
    assignee:  row[4] || '',
    dueDate:   row[5] || '',
    desc:      row[6] || '',
    published: row[7] === 'true',
    comments:  (() => { try { return JSON.parse(row[8] || '[]') } catch { return [] } })(),
  }
}

// ─── READ ALL TASKS ───────────────────────────────────────────────────────────
export async function loadTasks(spreadsheetId) {
  const data = await sheetsRequest(`/${spreadsheetId}/values/${SHEET_TITLE}!A2:I1000`)
  const rows = data.values || []
  return rows.map((r, i) => rowToTask(r, i + 2)).filter(Boolean)
}

// ─── APPEND ONE TASK ──────────────────────────────────────────────────────────
export async function appendTask(spreadsheetId, task) {
  const res = await sheetsRequest(
    `/${spreadsheetId}/values/${SHEET_TITLE}!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST',
    { values: [taskToRow(task)] }
  )
  // Return the actual row number assigned
  const range = res.updates?.updatedRange || ''
  const match = range.match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

// ─── UPDATE ONE TASK (by rowNum) ──────────────────────────────────────────────
export async function updateTaskRow(spreadsheetId, rowNum, task) {
  await sheetsRequest(
    `/${spreadsheetId}/values/${SHEET_TITLE}!A${rowNum}:I${rowNum}?valueInputOption=RAW`,
    'PUT',
    { values: [taskToRow(task)] }
  )
}

// ─── DELETE ONE TASK (by rowNum) — shift rows up ──────────────────────────────
export async function deleteTaskRow(spreadsheetId, sheetId, rowNum) {
  await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
    requests: [{
      deleteDimension: {
        range: { sheetId, dimension: 'ROWS', startIndex: rowNum - 1, endIndex: rowNum },
      },
    }],
  })
}

// ─── GET SHEET ID (numeric) ───────────────────────────────────────────────────
export async function getSheetId(spreadsheetId) {
  const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
  const sheet = meta.sheets?.find(s => s.properties.title === SHEET_TITLE)
  return sheet?.properties?.sheetId ?? 0
}
