import { useApp } from '../context/AppContext'
import { STATUS_MAP } from '../utils/helpers'

export default function DetailModal() {
  const {
    showDetailModal, setShowDetailModal,
    detailItem, setDetailItem,
    setShowPwdModal, setPwdAction,
  } = useApp()

  if (!showDetailModal || !detailItem) return null

  const m = detailItem
  const status = STATUS_MAP[m.status] || STATUS_MAP.plan

  const close = () => {
    setShowDetailModal(false)
    setDetailItem(null)
  }

  const onDelete = () => {
    setPwdAction('delete')
    close()
    setTimeout(() => setShowPwdModal(true), 200)
  }

  const onEdit = () => {
    setPwdAction('edit')
    close()
    setTimeout(() => setShowPwdModal(true), 200)
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="detail-modal">
        <div className="detail-header">
          <div className="detail-header-bg">{m.emoji || '🎬'}</div>
          <div className="detail-header-overlay"></div>
          <div className="detail-title-wrap">
            <h2>{m.title}</h2>
            <div className="detail-meta-line">
              {m.year && <span className="card-year">{m.year}</span>}
              {m.genre && <span className="card-genre">{m.genre}</span>}
              <span className={`badge ${status.cls}`}>{status.label}</span>
              {m.rating > 0 && (
                <div className="stars">
                  {'★'.repeat(m.rating)}{'☆'.repeat(5 - m.rating)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section-label">Your Note</div>
          <div className="detail-note">{m.note || 'No notes added yet.'}</div>
          <div className="detail-actions">
            <button className="btn btn-delete" onClick={onDelete}>🗑 Delete</button>
            <button className="btn btn-edit" onClick={onEdit}>✏️ Edit</button>
            <button className="btn btn-cancel" onClick={close}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
