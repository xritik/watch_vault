import { useApp } from '../context/AppContext'
import { STATUS_MAP } from '../utils/helpers'

export default function Card({ item }) {
  const { setDetailItem, setShowDetailModal } = useApp()

  const starsHTML = (n) => (
    <span className="stars">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )

  const openDetail = () => {
    setDetailItem(item)
    setShowDetailModal(true)
  }

  const status = STATUS_MAP[item.status] || STATUS_MAP.plan

  return (
    <div className="card" onClick={openDetail} data-id={item._id}>
      <div className="card-poster">{item.emoji || '🎬'}</div>
      <div className="card-body">
        <div className={`badge ${status.cls}`}>{status.label}</div>
        <div className="card-title">{item.title}</div>
        <div className="card-meta">
          {item.year && <span className="card-year">{item.year}</span>}
          {item.genre && <span className="card-genre">{item.genre}</span>}
        </div>
        {item.rating > 0 && starsHTML(item.rating)}
      </div>
    </div>
  )
}
