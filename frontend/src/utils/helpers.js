export const STATUS_MAP = {
  watched:  { label: '✅ Watched',       cls: 'badge-watched'  },
  watching: { label: '▶️ Watching',      cls: 'badge-watching' },
  plan:     { label: '📌 Plan to Watch', cls: 'badge-plan'     },
  dropped:  { label: '🚫 Dropped',       cls: 'badge-dropped'  },
}

export const starsHTML = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

export const generateId = () => String(Date.now())
