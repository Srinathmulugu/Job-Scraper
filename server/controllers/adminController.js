const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { runScrapersManually } = require('../cron/scraperScheduler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      await Job.deleteOne({ _id: job._id });
      // optionally delete related applications
      await Application.deleteMany({ jobId: job._id });
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({ totalUsers, totalJobs, totalApplications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Trigger scrapers
// @route   POST /api/admin/trigger-scrapers
// @access  Private/Admin
const triggerScrapers = async (req, res) => {
  try {
    // Run asynchronously, don't await so the request doesn't timeout
    runScrapersManually();
    res.json({ message: 'Scrapers triggered. Check server console for progress.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, deleteJob, getAdminStats, triggerScrapers };
