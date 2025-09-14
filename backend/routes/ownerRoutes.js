const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { requireAuth, requireRoles } = require('../middleware/auth');

router.get('/raters', requireAuth, requireRoles('owner'), ownerController.myStoreRaters);
router.get('/average', requireAuth, requireRoles('owner'), ownerController.myStoreAverage);
router.get('/store', requireAuth, requireRoles('owner'), ownerController.getMyStore);
router.post('/store', requireAuth, requireRoles('owner'), ownerController.upsertMyStore);
router.delete('/store', requireAuth, requireRoles('owner'), ownerController.deleteMyStore);

module.exports = router;

