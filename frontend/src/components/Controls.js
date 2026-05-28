import { useApp } from '../context/AppContext';

const TYPE_FILTERS = [
  { value: 'all',         label: 'All Types' },
  { value: 'movie',       label: 'Movies'    },
  { value: 'series',      label: 'Series'    },
  { value: 'anime',       label: 'Anime'     },
  { value: 'documentary', label: 'Docs'      },
];

export default function Controls() {
  const { typeFilter, setTypeFilter, search, setSearch, sort, setSort } = useApp();

  return (
    <div className="controls">
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          id="searchInput"
          placeholder="Search titles…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-btns" id="typeFilter">
        {TYPE_FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-btn${typeFilter === f.value ? ' active' : ''}`}
            onClick={() => setTypeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <select
        className="sort-select"
        id="sortSelect"
        value={sort}
        onChange={e => setSort(e.target.value)}
      >
        <option value="az">A → Z</option>
        <option value="newest">Newest Added</option>
        <option value="oldest">Oldest Added</option>
        <option value="rating">Highest Rated</option>
        <option value="year">By Year</option>
      </select>
    </div>
  );
}
