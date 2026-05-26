import { useState } from 'react';
import { useApp } from '../context/AppContext';

const STATUS_FILTERS = [
  { value: 'all',      label: 'All' },
  { value: 'watched',  label: 'Watched' },
  { value: 'watching', label: 'Watching' },
  { value: 'plan',     label: 'Plan to Watch' },
  { value: 'dropped',  label: 'Dropped' },
];

export default function Navbar() {
  const { statusFilter, setStatusFilter, theme, toggleTheme } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav id="mainNav">
        <div className="nav-logo">RITIK'S <span>WATCH VAULT</span></div>

        <div className="nav-links" id="statusFilter">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={statusFilter === f.value ? 'active' : ''}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <button className="ttoggle" id="themeToggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span id="tIcon">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span id="tLabel" className="toggle-label-text">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <div className="tt-track"><div className="tt-thumb"></div></div>
          </button>
          <button
            className="hamburger"
            id="hamburger"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${drawerOpen ? ' open' : ''}`} id="mobileDrawer">
        <div className="drawer-header">
          <span className="drawer-title">Filter</span>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="drawer-filters" id="mobileStatusFilter">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={statusFilter === f.value ? 'active' : ''}
              onClick={() => { setStatusFilter(f.value); setDrawerOpen(false); }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="drawer-divider"></div>
        <button className="drawer-theme-btn" onClick={toggleTheme}>
          <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          <div className="tt-track" style={{ marginLeft: 'auto' }}>
            <div className="tt-thumb"></div>
          </div>
        </button>
      </div>
      <div
        className={`drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
    </>
  );
}
