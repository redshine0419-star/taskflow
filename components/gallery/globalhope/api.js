// Portfolio port: this demo has no real backend at all, so every call goes
// straight to the localStorage-backed mock layer in mockApi.js (always async,
// to match the original app's fetch-based call shape).
import { mock } from './mockApi.js'

const TOKEN_KEY = 'gh_admin_token'

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export const api = {
  login: async (username, password) => mock.login(username, password),
  changePassword: async (currentPassword, newPassword) => mock.changePassword(currentPassword, newPassword),
  me: async () => mock.me(),

  banners: {
    list: async () => mock.banners.list(),
    listAdmin: async () => mock.banners.listAdmin(),
    create: async (data) => mock.banners.create(data),
    update: async (id, data) => mock.banners.update(id, data),
    remove: async (id) => mock.banners.remove(id),
  },

  programs: {
    list: async (category) => mock.programs.list(category),
    listAdmin: async () => mock.programs.listAdmin(),
    get: async (id) => mock.programs.get(id),
    create: async (data) => mock.programs.create(data),
    update: async (id, data) => mock.programs.update(id, data),
    remove: async (id) => mock.programs.remove(id),
  },

  news: {
    list: async (category) => mock.news.list(category),
    listAdmin: async () => mock.news.listAdmin(),
    get: async (id) => mock.news.get(id),
    create: async (data) => mock.news.create(data),
    update: async (id, data) => mock.news.update(id, data),
    remove: async (id) => mock.news.remove(id),
  },

  inquiries: {
    submit: async (data) => mock.inquiries.submit(data),
    list: async () => mock.inquiries.list(),
    updateStatus: async (id, status) => mock.inquiries.updateStatus(id, status),
    remove: async (id) => mock.inquiries.remove(id),
  },
}
