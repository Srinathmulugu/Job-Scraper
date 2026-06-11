const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { Parser } = require('@json2csv/node');

// @desc    Get all jobs with pagination and filtering
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    let query = {};
    if (req.query.role) query.title = { $regex: req.query.role, $options: 'i' };
    if (req.query.company) query.company = { $regex: req.query.company, $options: 'i' };
    if (req.query.location) query.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.jobType) {
      const types = req.query.jobType.split(',');
      query.jobType = { $in: types };
    }
    if (req.query.workMode) query.workMode = req.query.workMode;

    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalJobs: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
const searchJobs = async (req, res) => {
  try {
    const keyword = req.query.q ? {
      $or: [
        { title: { $regex: req.query.q, $options: 'i' } },
        { company: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } },
        { skills: { $regex: req.query.q, $options: 'i' } }
      ]
    } : {};

    const jobs = await Job.find({ ...keyword }).sort({ postedDate: -1 }).limit(20);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Save a job to user's saved list
// @route   POST /api/jobs/save
// @access  Private
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user.id);

    if (user.savedJobs.includes(jobId)) {
      // If already saved, unsave it
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.json({ message: 'Job removed from saved list', savedJobs: user.savedJobs });
    }

    user.savedJobs.push(jobId);
    await user.save();
    res.json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Apply for a job (track application)
// @route   POST /api/jobs/apply
// @access  Private
const applyJob = async (req, res) => {
  try {
    const { jobId, status, notes } = req.body;

    const existingApplication = await Application.findOne({ userId: req.user.id, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied or tracked this job' });
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId,
      status: status || 'Applied',
      notes
    });

    const user = await User.findById(req.user.id);
    user.appliedJobs.push(application._id);
    await user.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user applications
// @route   GET /api/jobs/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).populate('jobId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/jobs/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Export applications to CSV
// @route   GET /api/jobs/export/applications
// @access  Private
const exportApplicationsCSV = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).populate('jobId');
    
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found to export' });
    }

    const data = applications.map(app => ({
      JobTitle: app.jobId?.title || 'Unknown',
      Company: app.jobId?.company || 'Unknown',
      Status: app.status,
      AppliedDate: new Date(app.appliedDate).toLocaleDateString(),
      Notes: app.notes || ''
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('applications_export.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  searchJobs,
  saveJob,
  applyJob,
  getApplications,
  updateApplication,
  exportApplicationsCSV
};
