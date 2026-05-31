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
const PROJECTS_SHEET_TITLE = 'Projects'
const SUBTASKS_SHEET_TITLE = 'SubTasks'
const MEMBERS_SHEET_TITLE = 'Members'
const HEADERS = ['id', 'title', 'stage', 'priority', 'assignee', 'dueDate', 'desc', 'published', 'comments', 'projectId', 'labelIds', 'isKeyTask']
const PROJECT_HEADERS = ['id', 'name', 'color', 'description', 'createdAt']
const SUBTASK_HEADERS = ['id', 'taskId', 'title', 'done', 'assignee', 'dueDate']
const MEMBER_HEADERS = ['id', 'projectId', 'email', 'name', 'role', 'jobTitle', 'responsibilities', 'workStyle', 'avatarUrl']

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

  const authPending = params.get('auth_pending')
  if (authPending) {
    window.history.replaceState({}, '', window.location.pathname)
    return fetch('/api/auth/session')
      .then(res => {
        if (!res.ok) throw new Error('session fetch failed')
        return res.json()
      })
      .then(data => {
        const user = { name: data.name, email: data.email, picture: data.picture }
        saveSession(data.token, user)
        return { user }
      })
      .catch(() => ({ error: 'Failed to retrieve auth session' }))
  }

  return null
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
  if (list.files?.length > 0) {
    const sid = list.files[0].id
    // Ensure Projects and SubTasks sheets exist
    await ensureProjectsSheet(sid)
    await ensureSubTasksSheet(sid)
    await ensureMembersSheet(sid)
    return sid
  }

  const created = await sheetsRequest('', 'POST', {
    properties: { title: 'TaskFlow_Database' },
    sheets: [
      { properties: { title: SHEET_TITLE } },
      { properties: { title: PROJECTS_SHEET_TITLE } },
      { properties: { title: SUBTASKS_SHEET_TITLE } },
      { properties: { title: MEMBERS_SHEET_TITLE } },
    ],
  })
  await sheetsRequest(`/${created.spreadsheetId}/values/${SHEET_TITLE}!A1:L1?valueInputOption=RAW`, 'PUT', {
    values: [HEADERS],
  })
  await sheetsRequest(`/${created.spreadsheetId}/values/${PROJECTS_SHEET_TITLE}!A1:E1?valueInputOption=RAW`, 'PUT', {
    values: [PROJECT_HEADERS],
  })
  await sheetsRequest(`/${created.spreadsheetId}/values/${SUBTASKS_SHEET_TITLE}!A1:F1?valueInputOption=RAW`, 'PUT', {
    values: [SUBTASK_HEADERS],
  })
  await sheetsRequest(`/${created.spreadsheetId}/values/${MEMBERS_SHEET_TITLE}!A1:I1?valueInputOption=RAW`, 'PUT', {
    values: [MEMBER_HEADERS],
  })
  return created.spreadsheetId
}

async function ensureProjectsSheet(spreadsheetId) {
  try {
    const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
    const hasProjects = meta.sheets?.some(s => s.properties.title === PROJECTS_SHEET_TITLE)
    if (!hasProjects) {
      await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
        requests: [{ addSheet: { properties: { title: PROJECTS_SHEET_TITLE } } }],
      })
      await sheetsRequest(`/${spreadsheetId}/values/${PROJECTS_SHEET_TITLE}!A1:E1?valueInputOption=RAW`, 'PUT', {
        values: [PROJECT_HEADERS],
      })
    }
  } catch (e) {
    void e
  }
}

export async function ensureSubTasksSheet(spreadsheetId) {
  try {
    const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
    const has = meta.sheets?.some(s => s.properties.title === SUBTASKS_SHEET_TITLE)
    if (!has) {
      await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
        requests: [{ addSheet: { properties: { title: SUBTASKS_SHEET_TITLE } } }],
      })
      await sheetsRequest(`/${spreadsheetId}/values/${SUBTASKS_SHEET_TITLE}!A1:F1?valueInputOption=RAW`, 'PUT', {
        values: [SUBTASK_HEADERS],
      })
    }
  } catch (e) {
    void e
  }
}

// ─── TASK SERIALIZATION ───────────────────────────────────────────────────────
function taskToRow(task) {
  return [
    task.id, task.title, task.stage, task.priority,
    task.assignee || '', task.dueDate || '', task.desc || '',
    task.published ? 'true' : 'false',
    JSON.stringify(task.comments || []),
    task.projectId || '',
    JSON.stringify(task.labelIds || []),
    task.isKeyTask ? 'true' : 'false',
  ]
}

function rowToTask(row, rowNum) {
  if (!row[0]) return null
  return {
    id: Number(row[0]), rowNum,
    title: row[1] || '', stage: row[2] || 'planning', priority: row[3] || 'medium',
    assignee: row[4] || '', dueDate: row[5] || '', desc: row[6] || '',
    published: row[7] === 'true',
    comments: (() => { try { return JSON.parse(row[8] || '[]') } catch (e) { console.warn('rowToTask: bad comments JSON at row', rowNum, e); return [] } })(),
    projectId: row[9] || '',
    labelIds: (() => { try { return JSON.parse(row[10] || '[]') } catch (e) { console.warn('rowToTask: bad labelIds JSON at row', rowNum, e); return [] } })(),
    isKeyTask: row[11] === 'true',
  }
}

export async function loadTasks(spreadsheetId) {
  const data = await sheetsRequest(`/${spreadsheetId}/values/${SHEET_TITLE}!A2:L1000`)
  return (data.values || []).map((r, i) => rowToTask(r, i + 2)).filter(Boolean)
}

export async function appendTask(spreadsheetId, task) {
  const res = await sheetsRequest(
    `/${spreadsheetId}/values/${SHEET_TITLE}!A:L:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST', { values: [taskToRow(task)] }
  )
  const match = (res.updates?.updatedRange || '').match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

export async function updateTaskRow(spreadsheetId, rowNum, task) {
  await sheetsRequest(
    `/${spreadsheetId}/values/${SHEET_TITLE}!A${rowNum}:L${rowNum}?valueInputOption=RAW`,
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

// ─── SUBTASK SERIALIZATION ────────────────────────────────────────────────────
function subTaskToRow(st) {
  return [
    st.id, st.taskId, st.title, st.done ? 'true' : 'false',
    st.assignee || '', st.dueDate || '',
  ]
}

function rowToSubTask(row, rowNum) {
  if (!row[0]) return null
  return {
    id: row[0], rowNum,
    taskId: row[1] || '', title: row[2] || '',
    done: row[3] === 'true',
    assignee: row[4] || '', dueDate: row[5] || '',
  }
}

export async function loadSubTasks(spreadsheetId) {
  try {
    const data = await sheetsRequest(`/${spreadsheetId}/values/${SUBTASKS_SHEET_TITLE}!A2:F1000`)
    return (data.values || []).map((r, i) => rowToSubTask(r, i + 2)).filter(Boolean)
  } catch (e) {
    void e
    return []
  }
}

export async function appendSubTask(spreadsheetId, subTask) {
  const res = await sheetsRequest(
    `/${spreadsheetId}/values/${SUBTASKS_SHEET_TITLE}!A:F:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST', { values: [subTaskToRow(subTask)] }
  )
  const match = (res.updates?.updatedRange || '').match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

export async function updateSubTaskRow(spreadsheetId, rowNum, subTask) {
  await sheetsRequest(
    `/${spreadsheetId}/values/${SUBTASKS_SHEET_TITLE}!A${rowNum}:F${rowNum}?valueInputOption=RAW`,
    'PUT', { values: [subTaskToRow(subTask)] }
  )
}

export async function deleteSubTaskRow(spreadsheetId, subTasksSheetId, rowNum) {
  await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
    requests: [{ deleteDimension: {
      range: { sheetId: subTasksSheetId, dimension: 'ROWS', startIndex: rowNum - 1, endIndex: rowNum },
    }}],
  })
}

export async function getSubTasksSheetId(spreadsheetId) {
  const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
  const sheet = meta.sheets?.find(s => s.properties.title === SUBTASKS_SHEET_TITLE)
  return sheet?.properties?.sheetId ?? null
}

// ─── PROJECT SERIALIZATION ────────────────────────────────────────────────────
function projectToRow(project) {
  return [
    project.id, project.name, project.color || '#6366f1',
    project.description || '', project.createdAt || new Date().toISOString(),
  ]
}

function rowToProject(row, rowNum) {
  if (!row[0]) return null
  return {
    id: row[0], rowNum,
    name: row[1] || '', color: row[2] || '#6366f1',
    description: row[3] || '', createdAt: row[4] || '',
  }
}

export async function loadProjects(spreadsheetId) {
  try {
    const data = await sheetsRequest(`/${spreadsheetId}/values/${PROJECTS_SHEET_TITLE}!A2:E1000`)
    return (data.values || []).map((r, i) => rowToProject(r, i + 2)).filter(Boolean)
  } catch (e) {
    void e
    return []
  }
}

export async function appendProject(spreadsheetId, project) {
  const res = await sheetsRequest(
    `/${spreadsheetId}/values/${PROJECTS_SHEET_TITLE}!A:E:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST', { values: [projectToRow(project)] }
  )
  const match = (res.updates?.updatedRange || '').match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

export async function updateProject(spreadsheetId, rowNum, project) {
  await sheetsRequest(
    `/${spreadsheetId}/values/${PROJECTS_SHEET_TITLE}!A${rowNum}:E${rowNum}?valueInputOption=RAW`,
    'PUT', { values: [projectToRow(project)] }
  )
}

export async function deleteProject(spreadsheetId, projectsSheetId, rowNum) {
  await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
    requests: [{ deleteDimension: {
      range: { sheetId: projectsSheetId, dimension: 'ROWS', startIndex: rowNum - 1, endIndex: rowNum },
    }}],
  })
}

export async function getProjectsSheetId(spreadsheetId) {
  const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
  const sheet = meta.sheets?.find(s => s.properties.title === PROJECTS_SHEET_TITLE)
  return sheet?.properties?.sheetId ?? null
}

// ─── MEMBERS SHEET ────────────────────────────────────────────────────────────
export async function ensureMembersSheet(spreadsheetId) {
  try {
    const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
    const has = meta.sheets?.some(s => s.properties.title === MEMBERS_SHEET_TITLE)
    if (!has) {
      await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
        requests: [{ addSheet: { properties: { title: MEMBERS_SHEET_TITLE } } }],
      })
      await sheetsRequest(`/${spreadsheetId}/values/${MEMBERS_SHEET_TITLE}!A1:I1?valueInputOption=RAW`, 'PUT', {
        values: [MEMBER_HEADERS],
      })
    }
  } catch (e) {
    void e
  }
}

function memberToRow(member) {
  return [
    member.id, member.projectId, member.email, member.name,
    member.role || 'member', member.jobTitle || '',
    member.responsibilities || '', member.workStyle || '', member.avatarUrl || '',
  ]
}

function rowToMember(row, rowNum) {
  if (!row[0]) return null
  return {
    id: row[0], rowNum,
    projectId: row[1] || '', email: row[2] || '', name: row[3] || '',
    role: row[4] || 'member', jobTitle: row[5] || '',
    responsibilities: row[6] || '', workStyle: row[7] || '', avatarUrl: row[8] || '',
  }
}

export async function loadMembers(spreadsheetId) {
  try {
    const data = await sheetsRequest(`/${spreadsheetId}/values/${MEMBERS_SHEET_TITLE}!A2:I1000`)
    return (data.values || []).map((r, i) => rowToMember(r, i + 2)).filter(Boolean)
  } catch (e) {
    void e
    return []
  }
}

export async function appendMember(spreadsheetId, member) {
  const res = await sheetsRequest(
    `/${spreadsheetId}/values/${MEMBERS_SHEET_TITLE}!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST', { values: [memberToRow(member)] }
  )
  const match = (res.updates?.updatedRange || '').match(/(\d+)$/)
  return match ? Number(match[1]) : null
}

export async function updateMemberRow(spreadsheetId, rowNum, member) {
  await sheetsRequest(
    `/${spreadsheetId}/values/${MEMBERS_SHEET_TITLE}!A${rowNum}:I${rowNum}?valueInputOption=RAW`,
    'PUT', { values: [memberToRow(member)] }
  )
}

export async function deleteMemberRow(spreadsheetId, membersSheetId, rowNum) {
  await sheetsRequest(`/${spreadsheetId}:batchUpdate`, 'POST', {
    requests: [{ deleteDimension: {
      range: { sheetId: membersSheetId, dimension: 'ROWS', startIndex: rowNum - 1, endIndex: rowNum },
    }}],
  })
}

export async function getMembersSheetId(spreadsheetId) {
  const meta = await sheetsRequest(`/${spreadsheetId}?fields=sheets.properties`)
  const sheet = meta.sheets?.find(s => s.properties.title === MEMBERS_SHEET_TITLE)
  return sheet?.properties?.sheetId ?? null
}
