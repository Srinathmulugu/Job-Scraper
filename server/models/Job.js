const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String },
  description: { type: String, required: true },
  skills: [{ type: String }],
  location: { type: String },
  experience: { type: String },
  salary: { type: String },
  jobType: { type: String },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'Onsite', 'Not Specified'], default: 'Not Specified' },
  sourceWebsite: { type: String },
  applyLink: { type: String, required: true, unique: true }, // unique applyLink helps avoid duplicates
  postedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
