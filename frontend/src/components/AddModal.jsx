import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function AddModal() {
  const { showAddModal, setShowAddModal, addItem, updateItem, editItem, setEditItem } = useApp()
  const isEdit = !!editItem

  const [form, setForm] = useState({
    title: '', type: 'movie', year: '', genre: '',
    status: 'watched', rating: 0, emoji: '', note: '',
  })

  useEffect(() => {
    if (editItem) {
      setForm({
        title: editItem.title || '',
        type: editItem.type || 'movie',
        year: editItem.year || '',
        genre: editItem.genre || '',
        status: editItem.status || 'watched',
        rating: editItem.rating || 0,
        emoji: editItem.emoji || '',
        note: editItem.note || '',
      })
    } else {
      setForm({ title: '', type: 'movie', year: '', genre: '', status: 'watched', rating: 0, emoji: '', note: '' })
    }
  }, [editItem, showAddModal])

  const close = () => {
    setShowAddModal(false)
    setEditItem(null)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    if (isEdit) {
      await updateItem(editItem._id, form)
    } else {
      await addItem(form)
    }
    close()
  }

  const setRating = (v) => setForm(f => ({ ...f, rating: v }))

  if (!showAddModal) return null

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-title">{isEdit ? 'EDIT TITLE' : 'ADD TITLE'}</div>

        <div className="form-row">
          <label>Title *</label>
          <input type="text" placeholder="e.g. Interstellar" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>

        <div className="form-2col">
          <div className="form-row">
            <label>Type *</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="anime">Anime</option>
              <option value="documentary">Documentary</option>
            </select>
          </div>
          <div className="form-row">
            <label>Year</label>
            <input type="number" placeholder="2024" min="1900" max="2099" value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
          </div>
        </div>

        <div className="form-2col">
          <div className="form-row">
            <label>Genre</label>
            <input type="text" placeholder="Sci-fi, Drama…" value={form.genre}
              onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Status *</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="watched">Watched</option>
              <option value="watching">Watching</option>
              <option value="plan">Plan to Watch</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label>Rating</label>
          <div className="star-picker">
            {[1,2,3,4,5].map(v => (
              <span key={v} className={form.rating >= v ? 'lit' : ''}
                onClick={() => setRating(v)}
                onMouseEnter={() => setForm(f => ({ ...f, rating: v }))}
              >★</span>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Emoji / Poster Icon</label>
          <input type="text" placeholder="🎬" maxLength={2} value={form.emoji}
            onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
        </div>

        <div className="form-row">
          <label>Your Note</label>
          <textarea placeholder="What did you think?" value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={close}>Cancel</button>
          <button className="btn btn-save" onClick={handleSubmit}>
            {isEdit ? 'Update ♡' : 'Save ♡'}
          </button>
        </div>
      </div>
    </div>
  )
}
