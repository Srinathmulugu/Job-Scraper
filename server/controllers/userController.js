const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.skills) {
        try {
          user.skills = JSON.parse(req.body.skills);
        } catch(e) {
          user.skills = req.body.skills.split(',').map(s => s.trim());
        }
      }

      user.github = req.body.github || user.github;
      user.linkedin = req.body.linkedin || user.linkedin;

      if (req.file) {
        user.resume = `/${req.file.path.replace(/\\/g, '/')}`;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        skills: updatedUser.skills,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        resume: updatedUser.resume,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { updateProfile };
