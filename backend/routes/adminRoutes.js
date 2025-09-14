const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRoles } = require('../middleware/auth');

router.get('/dashboard', requireAuth, requireRoles('admin'), adminController.dashboardStats);
router.post('/users', requireAuth, requireRoles('admin'), adminController.createUser);
router.get('/users', requireAuth, requireRoles('admin'), adminController.listUsers);
router.get('/users/:id', requireAuth, requireRoles('admin'), adminController.getUserDetails);
router.put('/users/:id/owner-id', requireAuth, requireRoles('admin'), adminController.updateUserOwnerId);
router.get('/owners', requireAuth, requireRoles('admin'), adminController.getValidOwners);
router.post('/stores', requireAuth, requireRoles('admin'), adminController.createStore);
router.put('/stores/:id', requireAuth, requireRoles('admin'), adminController.updateStore);
router.delete('/stores/:id', requireAuth, requireRoles('admin'), adminController.deleteStore);
router.get('/stores', requireAuth, requireRoles('admin'), adminController.listStores);

module.exports = router;

