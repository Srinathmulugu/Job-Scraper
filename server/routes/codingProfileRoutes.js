const express = require('express');
const router = express.Router();
const { getCodingProfile, updateUrlsAndSync, removeCodingProfile } = require('../controllers/codingProfileController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getCodingProfile);
router.post('/sync', protect, updateUrlsAndSync);
router.delete('/remove', protect, removeCodingProfile);

module.exports = router;
