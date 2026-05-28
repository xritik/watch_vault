import { useApp } from '../context/AppContext';
import { STATUS_MAP } from '../utils/helpers';

export default function Card({ item }) {
  const { setDetailItem, setShowDetailModal, requestCardAction } = useApp();

  const status = STATUS_MAP[item.status] || STATUS_MAP.plan;

  const openDetail = () => {
    if (item.locked) return; // blocked
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

  return (
    <div className={`card${item.locked ? ' card-locked' : ''}`} onClick={openDetail}>

      {/* ── Top-right toggle buttons ── */}
      <div className="card-toggles" onClick={e => e.stopPropagation()}>
        <button
          className={`card-toggle-btn fav-btn${item.favorite ? ' active' : ''}`}
          onClick={onFavorite}
          title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {item.favorite ? '❤️' : '🤍'}
        </button>
        <button
          className={`card-toggle-btn lock-btn${item.locked ? ' active' : ''}`}
          onClick={onLock}
          title={item.locked ? 'Unlock card' : 'Lock card'}
        >
          {item.locked ? '🔒' : '🔓'}
        </button>
      </div>

      {/* ── Locked state ── */}
      {item.locked ? (
        <>
          <div className="card-poster locked-poster">🔒</div>
          <div className="card-body locked-body">
            <div className="locked-text">Aisi waisi cheez h yaar,<br />sabko nahi dikha sakte 🤫</div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
