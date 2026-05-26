const express = require('express');
const router = express.Router();
const {
  getAll,
  getStats,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/watchlistController');

router.get('/stats', getStats);
router.get('/', getAll);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
