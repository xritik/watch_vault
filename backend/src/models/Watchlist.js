const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    type:  { type: String, enum: ['movie', 'series', 'anime', 'documentary'], required: true },
    year:  { type: Number, min: 1900, max: 2099, default: null },
    genre: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['watched', 'watching', 'plan', 'dropped'], required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    emoji:  { type: String, default: '🎬' },
    note:   { type: String, trim: true, default: '' },
    added:  { type: Number, default: () => Date.now() },
    favorite: { type: Boolean, default: false },
    locked:   { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

watchlistSchema.index({ added: -1 });
watchlistSchema.index({ status: 1 });
watchlistSchema.index({ type: 1 });
watchlistSchema.index({ favorite: -1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
