const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, storeController.getAllStores);
router.post('/rate', requireAuth, storeController.submitRating);
router.get('/me/ratings', requireAuth, storeController.getMyRatings);

module.exports = router;