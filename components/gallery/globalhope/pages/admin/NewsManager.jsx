'use client'
import { useEffect, useState } from 'react'
import { api } from '../../api.js'

const CATEGORIES = ['공지사항', '보도자료', '캠페인 소식']
const emptyForm = { category: CATEGORIES[0], title: '', content: '', image_url: '' }

export default function NewsManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api.news
      .listAdmin()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({ category: item.category, title: item.title, content: item.content || '', image_url: item.image_url || '' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await api.news.update(editingId, form)
      else await api.news.create(form)
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('이 소식을 삭제하시겠습니까?')) return
    await api.news.remove(id)
    load()
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>소식 관리</h1>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>{editingId ? '소식 수정' : '새 소식 추가'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-row">
              <label>카테고리 *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>제목 *</label>
              <input required value={form.title} onChange={(e) => update('title', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <label>이미지 URL</label>
            <input value={form.image_url} onChange={(e) => update('image_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-row">
            <label>내용</label>
            <textarea rows={6} value={form.content} onChange={(e) => update('content', e.target.value)} />
          </div>
          <div className="row-actions">
            <button className="btn btn-primary" type="submit">{editingId ? '수정 저장' : '소식 추가'}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>취소</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>게시일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id}>
                  <td><span className="tag">{n.category}</span></td>
                  <td>{n.title}</td>
                  <td>{new Date(n.published_at).toLocaleDateString('ko-KR')}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(n)}>수정</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4}>등록된 소식이 없습니다.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
