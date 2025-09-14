const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);
router.post('/password', requireAuth, authController.updatePassword);

module.exports = router;

