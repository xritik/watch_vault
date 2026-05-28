import { useApp } from '../context/AppContext';
import { STATUS_MAP } from '../utils/helpers';

export default function Card({ item }) {
  const { setDetailItem, setShowDetailModal, requestCardAction } = useApp();

  const status = STATUS_MAP[item.status] || STATUS_MAP.plan;

  const openDetail = () => {
    if (item.locked) return;
    setDetailItem(item);
    setShowDetailModal(true);
  };

  const onFavorite = (e) => {
    e.stopPropagation();
    requestCardAction('favorite', item);
  };

  const onLock = (e) => {
    e.stopPropagation();
    requestCardAction('lock', item);
  };

  if (item.locked) {
    return (
      <div className="card card-locked">
        {/* Blurred layer — poster + hidden content underneath */}
        <div className="locked-blur-layer">
          <div className="card-poster">{item.emoji || '🎬'}</div>
          <div className="card-body">
            <div className={`badge ${status.cls}`}>{status.label}</div>
            <div className="card-title">{item.title}</div>
          </div>
        </div>

        {/* Sharp overlay — centered lock icon + message */}
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-text">Aisi waisi cheez h yaar,<br />sabko nahi dikha sakte 🤫</div>
        </div>

        {/* Toggle buttons — always sharp */}
        <div className="card-toggles">
          <button
            className={`card-toggle-btn fav-btn${item.favorite ? ' active' : ''}`}
            onClick={onFavorite}
            title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {item.favorite ? '❤️' : '🤍'}
          </button>
          <button
            className="card-toggle-btn lock-btn active"
            onClick={onLock}
            title="Unlock card"
          >
            🔒
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" onClick={openDetail}>
      {/* Toggle buttons */}
      <div className="card-toggles" onClick={e => e.stopPropagation()}>
        <button
          className={`card-toggle-btn fav-btn${item.favorite ? ' active' : ''}`}
          onClick={onFavorite}
          title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {item.favorite ? '❤️' : '🤍'}
        </button>
        <button
          className="card-toggle-btn lock-btn"
          onClick={onLock}
          title="Lock card"
        >
          🔓
        </button>
      </div>

      <div className="card-poster">{item.emoji || '🎬'}</div>
      <div className="card-body">
        {item.favorite && <div className="fav-badge">❤️ Favorite</div>}
        <div className={`badge ${status.cls}`}>{status.label}</div>
        <div className="card-title">{item.title}</div>
        <div className="card-meta">
          {item.year  && <span className="card-year">{item.year}</span>}
          {item.genre && <span className="card-genre">{item.genre}</span>}
        </div>
        {item.rating > 0 && (
          <div className="stars">
            {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
          </div>
        )}
      </div>
    </div>
  );
}
