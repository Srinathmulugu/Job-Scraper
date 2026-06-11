const { OpenAI } = require('openai');

// Simulated Enterprise S3 Architecture
const simulateS3Upload = async (buffer) => {
  return new Promise((resolve) => {
    // Simulate network delay to a cloud bucket
    setTimeout(() => {
      resolve(`https://mock-enterprise-s3.aws.com/resumes/${Date.now()}.pdf`);
    }, 800);
  });
};

// Deterministic N-Gram extraction to prevent LLM Hallucinations
const extractNGrams = (text, minN = 1, maxN = 2) => {
  const words = text.toLowerCase().replace(/[^a-z0-9+#.\-]/g, ' ').trim().split(/\s+/);
  const ngrams = new Set();
  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'they', 'your', 'will', 'can']);
  
  for (let n = minN; n <= maxN; n++) {
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n);
      if (phrase.some(w => stopWords.has(w))) continue;
      ngrams.add(phrase.join(' '));
    }
  }
  return Array.from(ngrams);
};

const getDeterministicMissingKeywords = (resumeText, jobDescription) => {
  const jdNgrams = extractNGrams(jobDescription, 1, 2);
  const resumeNgrams = new Set(extractNGrams(resumeText, 1, 2));
  
  // Find exact keyword matches that exist in JD but NOT in resume
  const missing = jdNgrams.filter(kw => !resumeNgrams.has(kw) && kw.length > 3);
  
  // Sort by length to prefer bigrams (more specific skills like 'machine learning')
  return missing.sort((a, b) => b.length - a.length).slice(0, 6);
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

const analyzeResume = async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    // Return mock data if no API key is provided so UI still works seamlessly
    return res.json({
      atsScore: 82,
      missingKeywords: ['Docker', 'Redux Toolkit', 'AWS Lambda'],
      suggestions: [
        'Quantify your achievements with specific metrics.',
        'Add more action verbs to the experience section.',
        'Include a direct link to your GitHub portfolio.'
      ]
    });
  }

  try {
    const prompt = `Analyze this resume against the job description. Return a JSON object strictly with the following keys: 'atsScore' (number 0-100), 'missingKeywords' (array of strings), and 'suggestions' (array of strings). Resume: ${resumeText}. Job Description: ${jobDescription}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ message: 'Failed to analyze resume' });
  }
};

const generateInterviewQuestions = async (req, res) => {
  const { role, experienceLevel } = req.body;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    return res.json({
      technical: [
        'Explain the Virtual DOM and how React reconciliation works.', 
        'What is a closure in JavaScript, and what are its practical use cases?'
      ],
      hr: [
        'Tell me about a time you had a technical disagreement with a coworker. How did you resolve it?', 
        'Describe a time when you had to learn a new technology quickly under pressure.'
      ],
      coding: [
        'Write an algorithm to reverse a linked list.', 
        'Implement a debounce function in plain JavaScript.'
      ]
    });
  }

  try {
    const prompt = `Generate interview questions for a ${experienceLevel} ${role}. Return a JSON object strictly with keys: 'technical' (array of strings), 'hr' (array of strings), and 'coding' (array of strings). Limit to 3 advanced questions each.`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const questions = JSON.parse(response.choices[0].message.content);
    res.json(questions);
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ message: 'Failed to generate questions' });
  }
};

const generateColdEmail = async (req, res) => {
  const { recipientName, companyName, jobRole, myResumeSummary } = req.body;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    return res.json({
      subject: `Passionate ${jobRole} eager to contribute to ${companyName}`,
      emailBody: `Hi ${recipientName || 'Hiring Manager'},\n\nI noticed your team at ${companyName} is looking for a ${jobRole}. Given my background in building scalable web applications and improving performance, I believe I could make an immediate impact on your engineering team.\n\nI’ve attached my resume for your review. Are you open to a quick 10-minute chat next week to discuss how my skills align with your current goals?\n\nBest regards,\n[Your Name]`,
      linkedinMessage: `Hi ${recipientName || 'there'}, I saw ${companyName} is hiring a ${jobRole}. I have a strong background in this stack and would love to connect and learn more about the engineering culture there!`
    });
  }

  try {
    const prompt = `Write a highly engaging, concise cold email and a short LinkedIn connection request message for a job application.\nRecipient Name: ${recipientName}\nCompany Name: ${companyName}\nTarget Role: ${jobRole}\nMy Summary: ${myResumeSummary}\n\nReturn a JSON object strictly with keys: 'subject' (email subject), 'emailBody' (the cold email copy), and 'linkedinMessage' (short LinkedIn connection note max 300 characters).`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const output = JSON.parse(response.choices[0].message.content);
    res.json(output);
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ message: 'Failed to generate outreach copy' });
  }
};

const generateChat = async (req, res) => {
  const { messages } = req.body;
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    return res.json({ reply: "I am currently in mock mode because no OpenAI API key was provided. But I am ready to help!" });
  }
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an AI career assistant built into the Job Scrapper platform. Be helpful, concise, and friendly.' },
        ...messages
      ]
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ message: 'Failed to chat with AI' });
  }
};

const evaluateInterviewAnswer = async (req, res) => {
  const { question, answer, role } = req.body;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    return res.json({
      technicalScore: 82,
      communicationScore: 88,
      confidenceScore: 79,
      feedback: 'Need better explanation of the core concepts and real-world use cases.'
    });
  }

  try {
    const prompt = `You are an expert technical interviewer evaluating a candidate for a ${role} role. 
    Question asked: "${question}"
    Candidate's transcribed answer: "${answer}"
    
    Evaluate the answer and return a JSON object strictly with the following keys:
    - 'technicalScore' (number 0-100)
    - 'communicationScore' (number 0-100)
    - 'confidenceScore' (number 0-100)
    - 'feedback' (string: short, constructive feedback on their answer)`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const evaluation = JSON.parse(response.choices[0].message.content);
    res.json(evaluation);
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ message: 'Failed to evaluate answer' });
  }
};

const pdf = require('pdf-parse');

const analyzeResumePdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume' });
  }

  const { jobDescription } = req.body;

  try {
    // 1. Simulate Cloud Upload
    const s3Url = await simulateS3Upload(req.file.buffer);
    console.log(`[Enterprise Logic] PDF uploaded to simulated S3: ${s3Url}`);

    // 2. Parse PDF buffer directly
    const data = await pdf(req.file.buffer);
    const resumeText = data.text;

    // 3. Extract exact N-Gram missing keywords deterministically
    const deterministicMissing = getDeterministicMissingKeywords(resumeText, jobDescription || '');

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
      return res.json({
        atsScore: 82,
        missingKeywords: deterministicMissing.length > 0 ? deterministicMissing : ['docker containers', 'aws lambda', 'redis cache', 'typescript'],
        suggestions: [
          'Add measurable achievements (e.g. increased speed by X%).',
          'Include more standard action verbs.',
          'Format dates correctly for ATS parsers.'
        ]
      });
    }

    const prompt = `Act as an elite ATS (Applicant Tracking System). Analyze this resume against the target job description.
    Job Description: "${jobDescription || 'General Software Engineer Role'}"
    Resume Text: "${resumeText}"
    Deterministic Missing Keywords Found: ${JSON.stringify(deterministicMissing)}
    
    Return a JSON object strictly with the following keys:
    - 'atsScore' (number 0-100 representing the match percentage)
    - 'missingKeywords' (array of strings, incorporate the deterministic missing keywords and refine them)
    - 'suggestions' (array of strings, 3 actionable bullet points to improve the resume)`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error('PDF Parse or OpenAI Error:', error);
    res.status(500).json({ message: 'Failed to analyze PDF resume' });
  }
};

module.exports = { analyzeResume, generateInterviewQuestions, generateColdEmail, generateChat, evaluateInterviewAnswer, analyzeResumePdf };
