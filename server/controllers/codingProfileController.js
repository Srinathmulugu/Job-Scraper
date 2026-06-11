const User = require('../models/User');
const extractUsername = require('../utils/extractUsername');
const { fetchGithubStats, fetchLeetcodeStats, fetchCodechefStats } = require('../services/codingProfileService');

const getCodingProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      codingProfiles: user.codingProfiles,
      codingStats: user.codingStats,
      codingStatsUpdatedAt: user.codingStatsUpdatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching coding profile' });
  }
};

const updateUrlsAndSync = async (req, res) => {
  try {
    const { githubUrl, leetcodeUrl, codechefUrl } = req.body;
    const user = await User.findById(req.user.id);

    user.codingProfiles = {
      githubUrl: githubUrl !== undefined ? githubUrl : user.codingProfiles.githubUrl,
      leetcodeUrl: leetcodeUrl !== undefined ? leetcodeUrl : user.codingProfiles.leetcodeUrl,
      codechefUrl: codechefUrl !== undefined ? codechefUrl : user.codingProfiles.codechefUrl
    };

    const githubUser = extractUsername(user.codingProfiles.githubUrl, 'github');
    const leetcodeUser = extractUsername(user.codingProfiles.leetcodeUrl, 'leetcode');
    const codechefUser = extractUsername(user.codingProfiles.codechefUrl, 'codechef');

    let newStats = { github: null, leetcode: null, codechef: null };

    const promises = [];
    if (githubUser) promises.push(fetchGithubStats(githubUser).then(r => newStats.github = r.success ? r.data : null));
    if (leetcodeUser) promises.push(fetchLeetcodeStats(leetcodeUser).then(r => newStats.leetcode = r.success ? r.data : null));
    if (codechefUser) promises.push(fetchCodechefStats(codechefUser).then(r => newStats.codechef = r.success ? r.data : null));

    await Promise.all(promises);

    user.codingStats = newStats;
    user.codingStatsUpdatedAt = new Date();
    await user.save();

    res.json({
      message: 'Profile URLs saved and stats synchronized successfully',
      codingProfiles: user.codingProfiles,
      codingStats: user.codingStats,
      codingStatsUpdatedAt: user.codingStatsUpdatedAt
    });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ message: 'Failed to sync profile statistics' });
  }
};

const removeCodingProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.codingProfiles = { githubUrl: '', leetcodeUrl: '', codechefUrl: '' };
    user.codingStats = null;
    user.codingStatsUpdatedAt = null;
    await user.save();
    res.json({ message: 'Accounts unlinked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unlink accounts' });
  }
};

module.exports = { getCodingProfile, updateUrlsAndSync, removeCodingProfile };
