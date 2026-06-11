const express = require('express');
const router = express.Router();
const { getUsers, deleteJob, getAdminStats, triggerScrapers } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.delete('/jobs/:id', protect, admin, deleteJob);
router.get('/stats', protect, admin, getAdminStats);
router.post('/trigger-scrapers', protect, admin, triggerScrapers);

module.exports = router;
