import { useApp } from '../context/AppContext';

export default function Hero() {
  const { stats } = useApp();

  return (
    <div className="hero">
      <p className="hero-eyebrow">♡ &nbsp; Ritik's Cinematic Universe &nbsp; ♡</p>
      <h1 className="hero-title">WATCH<br /><span className="hl">VAULT</span></h1>
      <p className="hero-sub">Every frame, every story — all in one place.</p>
      <div className="stats-bar" id="statsBar">
        <div className="stat">
          <span className="stat-n" id="statTotal">{stats.total}</span>
          <span className="stat-l">Total</span>
        </div>
        <div className="stat">
          <span className="stat-n" id="statMovies">{stats.movies}</span>
          <span className="stat-l">Movies</span>
        </div>
        <div className="stat">
          <span className="stat-n" id="statSeries">{(stats.series || 0) + (stats.anime || 0)}</span>
          <span className="stat-l">Series</span>
        </div>
        <div className="stat">
          <span className="stat-n" id="statWatched">{stats.watched}</span>
          <span className="stat-l">Watched</span>
        </div>
      </div>
    </div>
  );
}
