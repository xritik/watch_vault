const Watchlist = require('../models/Watchlist');

// Default seed data
const DEFAULT_DATA = [
  { title: 'Oppenheimer', type: 'movie', year: 2023, genre: 'Historical Drama', status: 'dropped', rating: 5, emoji: '💣', note: 'Absolutely mind-blowing. Nolan at his peak. The IMAX experience was life-changing.', added: Date.now() - 8e8 },
  { title: 'Game of Thrones', type: 'series', year: 2011, genre: 'Fantasy, Drama', status: 'watched', rating: 5, emoji: '⚔️', note: 'Nothing will ever top the first 4 seasons. The Red Wedding broke me. Season 8 happened but we don\'t talk about that.', added: Date.now() - 9.5e8 },
  { title: 'Pirates of the Caribbean', type: 'movie', year: 2003, genre: 'Adventure, Fantasy', status: 'watched', rating: 5, emoji: '🏴‍☠️', note: 'Jack Sparrow is one of the greatest characters ever put on screen. A childhood classic I will never stop rewatching.', added: Date.now() - 9.2e8 },
  { title: 'Alice in Borderland', type: 'series', year: 2020, genre: 'Thriller, Sci-Fi', status: 'watched', rating: 4, emoji: '🃏', note: 'Absolutely gripping. The game concepts are insane and the stakes feel real. Season 2 hit even harder.', added: Date.now() - 9.0e8 },
  { title: 'Titanic', type: 'movie', year: 1997, genre: 'Romance, Drama', status: 'watched', rating: 5, emoji: '🚢', note: 'There was definitely room on that door for Jack. Cried embarrassingly hard. James Cameron is a madman and a genius.', added: Date.now() - 8.8e8 },
  { title: 'The Boys', type: 'series', year: 2019, genre: 'Superhero, Satire', status: 'watched', rating: 5, emoji: '🦸', note: 'Homelander is the scariest villain on TV. This show says things no other show dares to. Butcher is my spirit animal.', added: Date.now() - 8.5e8 },
  { title: 'Breaking Bad', type: 'series', year: 2008, genre: 'Crime, Drama', status: 'watched', rating: 5, emoji: '🧪', note: 'The greatest TV show ever made. Walter White\'s transformation is the most compelling character arc in television history. I am the danger.', added: Date.now() - 8.2e8 },
  { title: 'Kabir Singh', type: 'movie', year: 2019, genre: 'Romance, Drama', status: 'watched', rating: 4, emoji: '🥃', note: 'Shahid Kapoor gave everything in this role. Controversial but the raw emotion hits different. Preeti tujhe salaam.', added: Date.now() - 8.0e8 },
  { title: 'DDLJ', type: 'movie', year: 1995, genre: 'Romance, Bollywood', status: 'watched', rating: 5, emoji: '🌻', note: 'The most iconic Bollywood romance ever made. Raj and Simran are forever. Bade bade deshon mein... a timeless classic.', added: Date.now() - 7.8e8 },
  { title: 'Jurassic Park', type: 'movie', year: 1993, genre: 'Sci-Fi, Adventure', status: 'watched', rating: 5, emoji: '🦕', note: 'Life finds a way. This film defined my childhood. The T-Rex reveal with that John Williams score is pure cinema magic.', added: Date.now() - 7.5e8 },
  { title: 'Money Heist', type: 'series', year: 2017, genre: 'Crime, Thriller', status: 'watched', rating: 4, emoji: '💰', note: 'Bella Ciao hits different after watching this. The Professor is the most brilliant TV strategist ever. Part 3 & 4 dragged but the finale redeemed everything.', added: Date.now() - 7.2e8 },
  { title: 'Squid Game', type: 'series', year: 2021, genre: 'Thriller, Drama', status: 'watched', rating: 5, emoji: '🟢', note: 'Nothing could have prepared me for episode 6. The whole world stopped for this show and rightfully so. Season 2 was a letdown though.', added: Date.now() - 7.0e8 },
  { title: 'Train to Busan', type: 'movie', year: 2016, genre: 'Horror, Action', status: 'watched', rating: 5, emoji: '🚆', note: 'Best zombie film since 28 Days Later. The father-daughter story wrecked me completely. Korean cinema is on another level.', added: Date.now() - 6.8e8 },
  { title: 'Tenet', type: 'movie', year: 2020, genre: 'Sci-Fi, Action', status: 'watched', rating: 4, emoji: '🔄', note: 'I understood maybe 60% of it the first watch. The inverted highway fight scene alone justifies its existence. Needs a rewatch with subtitles.', added: Date.now() - 6.5e8 },
  { title: 'Interstellar', type: 'movie', year: 2014, genre: 'Sci-Fi, Drama', status: 'watched', rating: 5, emoji: '🌌', note: 'The bookshelf scene made me genuinely weep. Hans Zimmer\'s score is otherworldly. Do not go gentle into that good night.', added: Date.now() - 6.2e8 },
  { title: 'Harry Potter', type: 'series', year: 2001, genre: 'Fantasy, Adventure', status: 'watched', rating: 5, emoji: '⚡', note: 'Grew up with these films. Prisoner of Azkaban is peak filmmaking. Always. The world JK Rowling built is unmatched.', added: Date.now() - 6.0e8 },
  { title: 'Dark', type: 'series', year: 2017, genre: 'Sci-Fi, Mystery', status: 'dropped', rating: 5, emoji: '🕳️', note: 'The most mind-bending show I have ever seen. Built an entire family tree spreadsheet just to follow the plot. German excellence.', added: Date.now() - 5.8e8 },
  { title: 'Better Call Saul', type: 'series', year: 2015, genre: 'Crime, Drama', status: 'dropped', rating: 5, emoji: '⚖️', note: 'It actually surpasses Breaking Bad in character depth. Jimmy McGill to Saul Goodman is a tragedy on par with Shakespeare. Bob Odenkirk deserved every award.', added: Date.now() - 5.5e8 },
  { title: 'House of the Dragon', type: 'series', year: 2022, genre: 'Fantasy, Drama', status: 'dropped', rating: 4, emoji: '🐉', note: 'Finally a worthy successor to early GoT. The Targaryen civil war is everything I wanted. Rhaenyra and Alicent\'s dynamic is complex and brilliant.', added: Date.now() - 5.2e8 },
  { title: 'Top Gun: Maverick', type: 'movie', year: 2022, genre: 'Action, Drama', status: 'watched', rating: 5, emoji: '✈️', note: 'Best sequel ever made, no debate. Tom Cruise refused to let cinema die and I will forever be grateful. The training sequence had me holding my breath.', added: Date.now() - 5.0e8 },
  { title: 'Godzilla', type: 'movie', year: 2014, genre: 'Sci-Fi, Action', status: 'watched', rating: 3, emoji: '🦖', note: 'The HALO jump scene is one of the greatest shots in blockbuster history. Everything else is just okay. Bryan Cranston deserved more screen time.', added: Date.now() - 4.8e8 },
  { title: 'Apollo 11', type: 'documentary', year: 2019, genre: 'Space, History', status: 'watched', rating: 5, emoji: '🚀', note: 'Restored archival footage that makes you feel like you were there in 1969. No narration, no talking heads — just pure awe-inspiring history. Must watch.', added: Date.now() - 4.5e8 },
];

// @desc  Get all items — favorites first (A→Z), then rest (A→Z), other sorts override this
// @route GET /api/watchlist
const getAll = async (req, res) => {
  try {
    const { status, type, search, sort } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (type   && type   !== 'all') query.type   = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ];
    }

    // Default: favorites first (A→Z), then rest (A→Z)
    // Other sort options work normally but favorites still bubble up
    let sortOption = { favorite: -1, title: 1 };
    if (sort === 'newest')  sortOption = { favorite: -1, added: -1 };
    else if (sort === 'oldest') sortOption = { favorite: -1, added: 1 };
    else if (sort === 'rating') sortOption = { favorite: -1, rating: -1 };
    else if (sort === 'az')     sortOption = { favorite: -1, title: 1 };
    else if (sort === 'year')   sortOption = { favorite: -1, year: -1 };

    const items = await Watchlist.find(query).sort(sortOption);

    if (items.length === 0 && !status && !type && !search) {
      const seeded = await Watchlist.insertMany(DEFAULT_DATA);
      return res.json({ success: true, data: seeded });
    }

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Stats
// @route GET /api/watchlist/stats
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

// @desc  Create
// @route POST /api/watchlist
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

// @desc  Update (includes toggling favorite/locked)
// @route PUT /api/watchlist/:id
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

// @desc  Delete
// @route DELETE /api/watchlist/:id
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
