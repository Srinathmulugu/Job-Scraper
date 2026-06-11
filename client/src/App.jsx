import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import JobFeed from './pages/JobFeed';
import ApplicationTracker from './pages/ApplicationTracker';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import CommandPalette from './components/CommandPalette';
import ChatbotWidget from './components/ChatbotWidget';
import SalaryPredictor from './pages/SalaryPredictor';
import CompanyInsights from './pages/CompanyInsights';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewAssistant from './pages/InterviewAssistant';
import ColdEmailAI from './pages/ColdEmailAI';
import CodingProfileTracker from './pages/CodingProfileTracker';
import LearningRoadmaps from './pages/LearningRoadmaps';
import ResumeBuilder from './pages/ResumeBuilder';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/jobs" element={<JobFeed />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          <Route path="/predictor" element={<SalaryPredictor />} />
          <Route path="/insights" element={<CompanyInsights />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/interview" element={<InterviewAssistant />} />
          <Route path="/outreach" element={<ColdEmailAI />} />
          <Route path="/coding-profile" element={<CodingProfileTracker />} />
          <Route path="/roadmaps" element={<LearningRoadmaps />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <CommandPalette />
      <ChatbotWidget />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
