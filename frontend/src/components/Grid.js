import { useApp } from '../context/AppContext';
import Card from './Card';

export default function Grid() {
  const { items, loading } = useApp();

  if (loading) {
    return (
      <div className="grid-wrap">
        <div className="loading-state" id="loadingState">
          <div className="loader-ring"></div>
          <p>Loading your vault…</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid-wrap">
        <div className="empty" id="emptyState">
          <div className="empty-icon">🎬</div>
          <p>No titles found. Try a different search or add something new!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-wrap">
      <div className="cards-grid" id="grid">
        {items.map(item => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
