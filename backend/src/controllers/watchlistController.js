const Watchlist = require('../models/Watchlist');

// Default seed data
const DEFAULT_DATA = [
  { title: 'Oppenheimer', type: 'movie', year: 2023, genre: 'Historical Drama', status: 'watched', rating: 5, emoji: '💣', note: 'Absolutely mind-blowing. Nolan at his peak. The IMAX experience was life-changing.', added: Date.now() - 8e8 },
  { title: 'Attack on Titan', type: 'anime', year: 2013, genre: 'Action, Dark Fantasy', status: 'watched', rating: 5, emoji: '⚔️', note: 'Greatest anime ever made. The final arc destroyed me emotionally.', added: Date.now() - 7e8 },
  { title: 'Dune: Part Two', type: 'movie', year: 2024, genre: 'Sci-Fi, Epic', status: 'watched', rating: 5, emoji: '🏜️', note: "Stunning visuals. Zendaya was incredible. Can't wait for Part Three.", added: Date.now() - 6e8 },
  { title: 'Peaky Blinders', type: 'series', year: 2013, genre: 'Crime, Drama', status: 'watched', rating: 5, emoji: '🎩', note: 'Tommy Shelby is one of the greatest TV characters of all time.', added: Date.now() - 5e8 },
  { title: 'The Bear', type: 'series', year: 2022, genre: 'Drama, Comedy', status: 'watching', rating: 4, emoji: '🐻', note: 'Intensely stressful in the best way possible. Season 2 is art.', added: Date.now() - 4e8 },
  { title: 'Past Lives', type: 'movie', year: 2023, genre: 'Romance, Drama', status: 'watched', rating: 5, emoji: '🌿', note: 'Quietly devastating. The ending made me stare at the ceiling for 20 minutes.', added: Date.now() - 3e8 },
  { title: 'Cyberpunk: Edgerunners', type: 'anime', year: 2022, genre: 'Sci-Fi, Action', status: 'watched', rating: 5, emoji: '🌆', note: '10 episodes. Made me cry like a baby. David Martinez lives forever.', added: Date.now() - 2.5e8 },
  { title: 'True Detective S1', type: 'series', year: 2014, genre: 'Crime, Mystery', status: 'watched', rating: 5, emoji: '🕵️', note: 'Rust Cohle monologues alone are worth the watch. Peak television.', added: Date.now() - 2e8 },
  { title: 'Poor Things', type: 'movie', year: 2023, genre: 'Fantasy, Drama', status: 'watched', rating: 4, emoji: '🔮', note: 'Weird, wild, wonderful. Emma Stone is from another planet.', added: Date.now() - 1.5e8 },
  { title: 'Severance', type: 'series', year: 2022, genre: 'Sci-Fi, Thriller', status: 'watching', rating: 5, emoji: '🏢', note: 'The most creative concept on TV. Every episode ends on a cliffhanger.', added: Date.now() - 1e8 },
  { title: 'Parasite', type: 'movie', year: 2019, genre: 'Thriller, Drama', status: 'watched', rating: 5, emoji: '🪲', note: 'Changed the way I think about cinema. The basement scene = peak cinema.', added: Date.now() - 9e7 },
  { title: 'Shogun (2024)', type: 'series', year: 2024, genre: 'Historical, Drama', status: 'plan', rating: 0, emoji: '⛩️', note: "Everyone says it's incredible. It's next on my list.", added: Date.now() - 5e7 },
];

// @desc    Get all watchlist items
// @route   GET /api/watchlist
const getAll = async (req, res) => {
  try {
    const { status, type, search, sort } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (type && type !== 'all') query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { added: -1 };
    if (sort === 'oldest') sortOption = { added: 1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'az') sortOption = { title: 1 };
    else if (sort === 'year') sortOption = { year: -1 };

    const items = await Watchlist.find(query).sort(sortOption);

    // Seed DB if empty
    if (items.length === 0 && !status && !type && !search) {
      const seeded = await Watchlist.insertMany(DEFAULT_DATA);
      return res.json({ success: true, data: seeded });
    }

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stats (counts)
// @route   GET /api/watchlist/stats
const getStats = async (req, res) => {
  try {
    const [total, movies, series, anime, docs, watched] = await Promise.all([
      Watchlist.countDocuments(),
      Watchlist.countDocuments({ type: 'movie' }),
      Watchlist.countDocuments({ type: 'series' }),
      Watchlist.countDocuments({ type: 'anime' }),
      Watchlist.countDocuments({ type: 'documentary' }),
      Watchlist.countDocuments({ status: 'watched' }),
    ]);
    res.json({ success: true, data: { total, movies, series, anime, docs, watched } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new item
// @route   POST /api/watchlist
const createItem = async (req, res) => {
  try {
    const item = await Watchlist.create({ ...req.body, added: Date.now() });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item (requires password verification done on frontend via /api/auth/verify)
// @route   PUT /api/watchlist/:id
const updateItem = async (req, res) => {
  try {
    const item = await Watchlist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete item (requires password verification done on frontend via /api/auth/verify)
// @route   DELETE /api/watchlist/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Watchlist.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getStats, createItem, updateItem, deleteItem };
