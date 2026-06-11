const express = require('express');
const router = express.Router();
const { getJobs, getJobById, searchJobs, saveJob, applyJob, getApplications, updateApplication, exportApplicationsCSV } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getJobs);
router.get('/applications', protect, getApplications); // Must be before /:id
router.get('/export/applications', protect, exportApplicationsCSV);
router.get('/search', searchJobs); // Needs to be before /:id to avoid mapping 'search' to :id
router.get('/:id', getJobById);
router.post('/save', protect, saveJob);
router.post('/apply', protect, applyJob);
router.put('/applications/:id', protect, updateApplication);

module.exports = router;
