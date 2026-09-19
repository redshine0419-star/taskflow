// Client-only fallback data & logic, used automatically when no real backend
// (server/) is reachable — e.g. a static-only deployment like a plain Vercel
// frontend deploy. Lets the site work as a self-contained demo in the browser.

const KEYS = {
  banners: 'gh_mock_banners',
  programs: 'gh_mock_programs',
  news: 'gh_mock_news',
  inquiries: 'gh_mock_inquiries',
  adminPassword: 'gh_mock_admin_password',
}

const SEED_BANNERS = [
  { id: 1, title: '한 아이의 결연이, 한 마을의 내일을 바꿉니다', subtitle: '아동결연 후원으로 희망을 전해주세요', image_url: 'https://picsum.photos/seed/gh-banner-1/1600/700', link_url: '/programs', sort_order: 1, active: 1, created_at: new Date().toISOString() },
  { id: 2, title: '긴급구호 캠페인', subtitle: '재난과 분쟁으로 고통받는 아이들에게 생명을 지켜주는 손길이 필요합니다', image_url: 'https://picsum.photos/seed/gh-banner-2/1600/700', link_url: '/programs', sort_order: 2, active: 1, created_at: new Date().toISOString() },
  { id: 3, title: '정기후원으로 함께하는 변화', subtitle: '매달 작은 나눔이 아이의 교육과 건강을 지킵니다', image_url: 'https://picsum.photos/seed/gh-banner-3/1600/700', link_url: '/donate', sort_order: 3, active: 1, created_at: new Date().toISOString() },
]

const SEED_PROGRAMS = [
  { id: 1, category: '아동결연', title: '1:1 아동결연 후원', summary: '한 아이와 결연하여 교육, 건강, 정서적 지지를 지속적으로 지원합니다.', content: '아동결연 후원자가 되시면 매달 후원금이 결연 아동이 속한 지역사회의 교육, 보건, 영양 사업에 사용됩니다. 결연 아동과 편지를 주고받으며 성장 과정을 함께할 수 있습니다.', image_url: 'https://picsum.photos/seed/gh-program-1/900/600', active: 1, created_at: new Date().toISOString() },
  { id: 2, category: '국내사업', title: '취약계층 아동 자립 지원', summary: '국내 저소득 가정 아동과 청소년의 교육 격차 해소와 자립을 돕습니다.', content: '방과 후 학습 지원, 심리 상담, 자립 준비 프로그램 등을 통해 국내 취약계층 아동이 안전하게 성장할 수 있도록 지원합니다.', image_url: 'https://picsum.photos/seed/gh-program-2/900/600', active: 1, created_at: new Date().toISOString() },
  { id: 3, category: '해외사업', title: '식수 위생 개선 사업', summary: '깨끗한 물이 없는 지역에 우물과 위생 시설을 지어 아동 건강을 지킵니다.', content: '오염된 물로 인한 질병으로 고통받는 아이들을 위해 우물 개발, 정수 시설 보급, 위생 교육을 진행합니다.', image_url: 'https://picsum.photos/seed/gh-program-3/900/600', active: 1, created_at: new Date().toISOString() },
  { id: 4, category: '긴급구호', title: '재난 긴급구호 캠페인', summary: '자연재해와 분쟁 지역의 아동과 가족에게 긴급 구호물품을 전달합니다.', content: '재난 발생 초기 골든타임에 식량, 의약품, 임시 거처 등을 신속히 지원하여 생명을 지킵니다.', image_url: 'https://picsum.photos/seed/gh-program-4/900/600', active: 1, created_at: new Date().toISOString() },
  { id: 5, category: '캠페인', title: '희망의 선물상자 캠페인', summary: '연말연시, 전 세계 아동들에게 희망의 선물을 전달하는 캠페인입니다.', content: '후원자가 보내주신 선물상자는 교육용품, 위생용품, 장난감 등으로 채워져 아이들에게 직접 전달됩니다.', image_url: 'https://picsum.photos/seed/gh-program-5/900/600', active: 1, created_at: new Date().toISOString() },
]

const SEED_NEWS = [
  { id: 1, category: '공지사항', title: '2026년 후원금 사용 내역 공개', content: '투명한 후원금 운영을 위해 2026년 상반기 후원금 사용 내역을 홈페이지에 공개하였습니다. 후원금은 아동결연, 국내외 사업, 긴급구호 등에 사용되었습니다.', image_url: 'https://picsum.photos/seed/gh-news-1/900/500', published_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 2, category: '보도자료', title: '식수 위생 개선 사업, 현지 마을 300세대에 새 우물 제공', content: '지난 분기 진행된 식수 위생 개선 사업을 통해 현지 마을 300세대가 깨끗한 물을 이용할 수 있게 되었습니다.', image_url: 'https://picsum.photos/seed/gh-news-2/900/500', published_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 3, category: '캠페인 소식', title: '희망의 선물상자, 올해 목표 1만 개 달성', content: '연말 캠페인으로 진행된 희망의 선물상자가 목표했던 1만 개를 초과 달성하며 성공적으로 마무리되었습니다.', image_url: 'https://picsum.photos/seed/gh-news-3/900/500', published_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 4, category: '공지사항', title: '개인정보처리방침 개정 안내', content: '관련 법령 개정에 따라 개인정보처리방침 일부 내용이 개정되었습니다. 자세한 내용은 본문을 참고해 주세요.', image_url: 'https://picsum.photos/seed/gh-news-4/900/500', published_at: new Date().toISOString(), created_at: new Date().toISOString() },
]

function loadCollection(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    /* localStorage unavailable — fall through to seed */
  }
  saveCollection(key, seed)
  return seed
}

function saveCollection(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* ignore — demo state just won't persist across reloads */
  }
}

function nextId(items) {
  return items.reduce((max, i) => Math.max(max, i.id), 0) + 1
}

function ensureAuth() {
  const token = localStorage.getItem('gh_admin_token')
  if (!token) throw new Error('인증이 필요합니다.')
}

function makeResourceCrud(key, seed) {
  return {
    all: () => loadCollection(key, seed),
    listPublic(category) {
      const items = loadCollection(key, seed).filter((i) => i.active !== 0)
      if (category && category !== '전체') return items.filter((i) => i.category === category)
      return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    listAdmin() {
      ensureAuth()
      return [...loadCollection(key, seed)].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    get(id) {
      const item = loadCollection(key, seed).find((i) => i.id === Number(id))
      if (!item) throw new Error('항목을 찾을 수 없습니다.')
      return item
    },
    create(data) {
      ensureAuth()
      const items = loadCollection(key, seed)
      const item = { id: nextId(items), active: 1, created_at: new Date().toISOString(), ...data }
      const updated = [...items, item]
      saveCollection(key, updated)
      return item
    },
    update(id, data) {
      ensureAuth()
      const items = loadCollection(key, seed)
      let updatedItem = null
      const updated = items.map((i) => {
        if (i.id === Number(id)) {
          updatedItem = { ...i, ...data, active: data.active === false ? 0 : data.active === true ? 1 : (data.active ?? i.active) }
          return updatedItem
        }
        return i
      })
      if (!updatedItem) throw new Error('항목을 찾을 수 없습니다.')
      saveCollection(key, updated)
      return updatedItem
    },
    remove(id) {
      ensureAuth()
      const items = loadCollection(key, seed)
      saveCollection(key, items.filter((i) => i.id !== Number(id)))
      return { ok: true }
    },
  }
}

const bannersCrud = makeResourceCrud(KEYS.banners, SEED_BANNERS)
const programsCrud = makeResourceCrud(KEYS.programs, SEED_PROGRAMS)
const newsCrud = makeResourceCrud(KEYS.news, SEED_NEWS)

function getAdminPassword() {
  try {
    return localStorage.getItem(KEYS.adminPassword) || 'admin1234'
  } catch {
    return 'admin1234'
  }
}

function setAdminPassword(pw) {
  try {
    localStorage.setItem(KEYS.adminPassword, pw)
  } catch {
    /* ignore */
  }
}

export const mock = {
  login(username, password) {
    if (username === 'admin' && password === getAdminPassword()) {
      return { token: 'demo-local-token', username: 'admin' }
    }
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다. (데모 모드: admin / admin1234)')
  },
  changePassword(currentPassword, newPassword) {
    ensureAuth()
    if (currentPassword !== getAdminPassword()) {
      throw new Error('현재 비밀번호가 올바르지 않습니다.')
    }
    setAdminPassword(newPassword)
    return { ok: true }
  },
  me() {
    ensureAuth()
    return { id: 1, username: 'admin' }
  },

  banners: {
    list: () => bannersCrud.listPublic().sort((a, b) => a.sort_order - b.sort_order),
    listAdmin: () => bannersCrud.listAdmin(),
    create: (data) => bannersCrud.create(data),
    update: (id, data) => bannersCrud.update(id, data),
    remove: (id) => bannersCrud.remove(id),
  },

  programs: {
    list: (category) => programsCrud.listPublic(category),
    listAdmin: () => programsCrud.listAdmin(),
    get: (id) => programsCrud.get(id),
    create: (data) => programsCrud.create(data),
    update: (id, data) => programsCrud.update(id, data),
    remove: (id) => programsCrud.remove(id),
  },

  news: {
    list: (category) => newsCrud.listPublic(category),
    listAdmin: () => newsCrud.listAdmin(),
    get: (id) => newsCrud.get(id),
    create: (data) => newsCrud.create(data),
    update: (id, data) => newsCrud.update(id, data),
    remove: (id) => newsCrud.remove(id),
  },

  inquiries: {
    submit(data) {
      const items = loadCollection(KEYS.inquiries, [])
      const item = { id: nextId(items), status: 'new', created_at: new Date().toISOString(), ...data }
      saveCollection(KEYS.inquiries, [...items, item])
      return { id: item.id }
    },
    list() {
      ensureAuth()
      return [...loadCollection(KEYS.inquiries, [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    updateStatus(id, status) {
      ensureAuth()
      const items = loadCollection(KEYS.inquiries, [])
      let updatedItem = null
      const updated = items.map((i) => {
        if (i.id === Number(id)) {
          updatedItem = { ...i, status }
          return updatedItem
        }
        return i
      })
      if (!updatedItem) throw new Error('문의를 찾을 수 없습니다.')
      saveCollection(KEYS.inquiries, updated)
      return updatedItem
    },
    remove(id) {
      ensureAuth()
      const items = loadCollection(KEYS.inquiries, [])
      saveCollection(KEYS.inquiries, items.filter((i) => i.id !== Number(id)))
      return { ok: true }
    },
  },
}
