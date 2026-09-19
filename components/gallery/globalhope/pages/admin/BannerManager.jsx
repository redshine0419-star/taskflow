'use client'
import { useEffect, useState } from 'react'
import { api } from '../../api.js'

const emptyForm = { title: '', subtitle: '', image_url: '', link_url: '', sort_order: 0, active: true }

export default function BannerManager() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api.banners
      .listAdmin()
      .then(setBanners)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function startEdit(banner) {
    setEditingId(banner.id)
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      sort_order: banner.sort_order,
      active: !!banner.active,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.banners.update(editingId, form)
      } else {
        await api.banners.create(form)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('이 배너를 삭제하시겠습니까?')) return
    await api.banners.remove(id)
    load()
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1>배너 관리</h1>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>{editingId ? '배너 수정' : '새 배너 추가'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-row">
              <label>제목 *</label>
              <input required value={form.title} onChange={(e) => update('title', e.target.value)} />
            </div>
            <div className="form-row">
              <label>부제목</label>
              <input value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <label>이미지 URL *</label>
            <input required value={form.image_url} onChange={(e) => update('image_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-grid-2">
            <div className="form-row">
              <label>연결 링크</label>
              <input value={form.link_url} onChange={(e) => update('link_url', e.target.value)} placeholder="/programs" />
            </div>
            <div className="form-row">
              <label>정렬 순서</label>
              <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <label>
              <input type="checkbox" style={{ width: 'auto', marginRight: 8 }} checked={form.active} onChange={(e) => update('active', e.target.checked)} />
              공개 상태 (체크 해제 시 사이트에 노출되지 않음)
            </label>
          </div>
          <div className="row-actions">
            <button className="btn btn-primary" type="submit">{editingId ? '수정 저장' : '배너 추가'}</button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>취소</button>
            )}
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
                <th>순서</th>
                <th>제목</th>
                <th>미리보기</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id}>
                  <td>{b.sort_order}</td>
                  <td>{b.title}<br /><small style={{ color: '#888' }}>{b.subtitle}</small></td>
                  <td><img src={b.image_url} alt={b.title} style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 6 }} /></td>
                  <td>{b.active ? '공개' : '비공개'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(b)}>수정</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr><td colSpan={5}>등록된 배너가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
