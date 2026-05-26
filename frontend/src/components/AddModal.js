import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function AddModal() {
  const { showAddModal, setShowAddModal, addItem, updateItem, editItem, setEditItem } = useApp();
  const isEdit = !!editItem;

  const emptyForm = {
    title: '', type: 'movie', year: '', genre: '',
    status: 'watched', rating: 0, emoji: '', note: '',
  };

  const [form,       setForm]       = useState(emptyForm);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (editItem) {
      setForm({
        title:  editItem.title  || '',
        type:   editItem.type   || 'movie',
        year:   editItem.year   || '',
        genre:  editItem.genre  || '',
        status: editItem.status || 'watched',
        rating: editItem.rating || 0,
        emoji:  editItem.emoji  || '',
        note:   editItem.note   || '',
      });
    } else {
      setForm(emptyForm);
    }
    setHoverRating(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem, showAddModal]);

  const close = () => {
    setShowAddModal(false);
    setEditItem(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    const payload = { ...form, year: form.year ? Number(form.year) : null };
    if (isEdit) {
      await updateItem(editItem._id, payload);
    } else {
      await addItem(payload);
    }
    close();
  };

  if (!showAddModal) return null;

  const displayRating = hoverRating || form.rating;

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-title">{isEdit ? 'EDIT TITLE' : 'ADD TITLE'}</div>

        <div className="form-row">
          <label>Title *</label>
          <input
            type="text" placeholder="e.g. Interstellar" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
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
            <input
              type="number" placeholder="2024" min="1900" max="2099" value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-2col">
          <div className="form-row">
            <label>Genre</label>
            <input
              type="text" placeholder="Sci-fi, Drama…" value={form.genre}
              onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
            />
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
          <div
            className="star-picker"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map(v => (
              <span
                key={v}
                style={{ color: v <= displayRating ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer' }}
                onClick={() => setForm(f => ({ ...f, rating: v }))}
                onMouseEnter={() => setHoverRating(v)}
              >★</span>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Emoji / Poster Icon</label>
          <input
            type="text" placeholder="🎬" maxLength={2} value={form.emoji}
            onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
          />
        </div>

        <div className="form-row">
          <label>Your Note</label>
          <textarea
            placeholder="What did you think?" value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={close}>Cancel</button>
          <button className="btn btn-save"   onClick={handleSubmit}>
            {isEdit ? 'Update ♡' : 'Save ♡'}
          </button>
        </div>
      </div>
    </div>
  );
}
