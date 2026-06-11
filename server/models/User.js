const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profileImage: { type: String },
  resume: { type: String },
  github: { type: String },
  linkedin: { type: String },
  skills: [{ type: String }],
  education: [{
    institution: String,
    degree: String,
    year: String
  }],
  experience: [{
    company: String,
    role: String,
    years: String
  }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  xp: { type: Number, default: 1450 },
  level: { type: Number, default: 5 },
  codingProfiles: {
    githubUrl: { type: String, default: '' },
    leetcodeUrl: { type: String, default: '' },
    codechefUrl: { type: String, default: '' }
  },
  codingStats: { type: Object, default: null },
  codingStatsUpdatedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
