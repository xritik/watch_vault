import { useApp } from '../context/AppContext'

export default function Hero() {
  const { stats } = useApp()

  return (
    <div className="hero">
      <p className="hero-eyebrow">♡ &nbsp; Ritik's Cinematic Universe &nbsp; ♡</p>
      <h1 className="hero-title">WATCH<br /><span className="hl">VAULT</span></h1>
      <p className="hero-sub">Every frame, every story — all in one place.</p>
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-n">{stats.total}</span>
          <span className="stat-l">Total</span>
        </div>
        <div className="stat">
          <span className="stat-n">{stats.movies}</span>
          <span className="stat-l">Movies</span>
        </div>
        <div className="stat">
          <span className="stat-n">{stats.series + (stats.anime || 0)}</span>
          <span className="stat-l">Series</span>
        </div>
        <div className="stat">
          <span className="stat-n">{stats.watched}</span>
          <span className="stat-l">Watched</span>
        </div>
      </div>
    </div>
  )
}
