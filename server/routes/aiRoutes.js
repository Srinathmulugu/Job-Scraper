const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, generateInterviewQuestions, generateColdEmail, generateChat, evaluateInterviewAnswer, analyzeResumePdf } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/resume', protect, analyzeResume);
router.post('/resume/pdf', protect, upload.single('resume'), analyzeResumePdf);
router.post('/interview', protect, generateInterviewQuestions);
router.post('/evaluate-interview', protect, evaluateInterviewAnswer);
router.post('/email', protect, generateColdEmail);
router.post('/chat', protect, generateChat);

module.exports = router;
