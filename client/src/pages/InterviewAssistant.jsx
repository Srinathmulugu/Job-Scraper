import React, { useState, useContext, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge, Accordion, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiCode, FiUser, FiMic, FiMicOff, FiCheckCircle, FiPlayCircle, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InterviewAssistant = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ role: '', experienceLevel: 'Mid Level', track: 'Frontend', difficulty: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);

  // Interview Mode States
  const [mode, setMode] = useState('setup'); // setup | overview | interview | report
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  const [evaluating, setEvaluating] = useState(false);
  
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.role) return toast.error('Job Role is required');
    
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/ai/interview', formData, config);
      setQuestions(data);
      setInterviewQuestions([...data.technical, ...data.hr]);
      setMode('overview');
      toast.success('Questions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate questions');
    }
    setLoading(false);
  };

  const startVoiceInterview = () => {
    if (!browserSupportsSpeechRecognition) {
      return toast.error('Browser doesn\'t support speech recognition. Please use Google Chrome.');
    }
    setCurrentIndex(0);
    setEvaluations([]);
    resetTranscript();
    setMode('interview');
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      return toast.error('Please provide an answer before submitting.');
    }
    
    if (listening) SpeechRecognition.stopListening();
    setEvaluating(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        question: interviewQuestions[currentIndex],
        answer: transcript,
        role: formData.role
      };
      const { data } = await axios.post('http://localhost:5000/api/ai/evaluate-interview', payload, config);
      
      setEvaluations(prev => [...prev, { question: payload.question, answer: transcript, evaluation: data }]);
      resetTranscript();
      
      if (currentIndex + 1 < interviewQuestions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setMode('report');
      }
    } catch (error) {
      toast.error('Failed to evaluate answer. Try again.');
    }
    setEvaluating(false);
  };

  // Render Logic
  const renderSetup = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-5">
        <Badge bg="primary" className="mb-2 px-3 py-2 fw-normal rounded-pill">Powered by OpenAI GPT-4o</Badge>
        <h2 className="fw-bold gradient-text">AI Interview Assistant</h2>
        <p className="text-muted">Generate highly targeted questions and take a live Voice Mock Interview.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="glass-card border-0 shadow-sm p-4 mb-5">
            <Form onSubmit={handleGenerate} className="d-flex flex-column gap-3">
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Control type="text" placeholder="Target Role (e.g. Google SWE, Netflix Backend)" onChange={(e) => setFormData({...formData, role: e.target.value})} required className="py-2" />
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Select onChange={(e) => setFormData({...formData, track: e.target.value})} className="py-2">
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>Fullstack</option>
                    <option>System Design</option>
                    <option>Data Science</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Select onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})} className="py-2">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Select onChange={(e) => setFormData({...formData, difficulty: e.target.value})} className="py-2">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                    <option>Expert</option>
                  </Form.Select>
                </Col>
              </Row>
              <div className="text-end">
                <Button variant="primary" type="submit" disabled={loading} className="px-5 py-2 fw-bold hover-lift rounded-pill" style={{ minWidth: '160px' }}>
                  {loading ? <Spinner size="sm" /> : 'Generate'}
                </Button>
              </div>
            </Form>
          </Card>

          {loading && (
            <Card className="glass-card border-0 shadow-sm p-4 mt-4 ai-pulse-loader text-center w-100">
              <div className="mb-3">
                <FiMessageSquare size={40} className="text-primary pulse-icon" />
              </div>
              <h5 className="text-primary fw-bold gradient-text">Synthesizing tailored questions...</h5>
              <p className="text-muted small mb-0">Structuring interview syllabus based on real-world requirements</p>
            </Card>
          )}
        </Col>
      </Row>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Generated Interview Set</h3>
        <Button variant="success" size="lg" className="rounded-pill px-4 fw-bold shadow hover-lift" onClick={startVoiceInterview}>
          <FiPlayCircle className="me-2" size={22}/> Start Voice Interview
        </Button>
      </div>

      <Accordion defaultActiveKey="0" className="shadow-sm">
        <Accordion.Item eventKey="0" className="border-0 mb-3 rounded overflow-hidden">
          <Accordion.Header><FiCode className="me-2 text-primary"/> Technical Deep-Dive</Accordion.Header>
          <Accordion.Body className="bg-light">
            <ol className="ps-3 mb-0">
              {questions.technical.map((q, i) => <li key={i} className="mb-3 text-dark fw-semibold">{q}</li>)}
            </ol>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="border-0 mb-3 rounded overflow-hidden">
          <Accordion.Header><FiMessageSquare className="me-2 text-warning"/> Behavioral & HR</Accordion.Header>
          <Accordion.Body className="bg-light">
            <ol className="ps-3 mb-0">
              {questions.hr.map((q, i) => <li key={i} className="mb-3 text-dark fw-semibold">{q}</li>)}
            </ol>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className="border-0 rounded overflow-hidden">
          <Accordion.Header><FiUser className="me-2 text-danger"/> Coding Challenges (Manual Practice)</Accordion.Header>
          <Accordion.Body className="bg-light">
            <ol className="ps-3 mb-0">
              {questions.coding.map((q, i) => <li key={i} className="mb-3 text-dark fw-semibold">{q}</li>)}
            </ol>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </motion.div>
  );

  const renderInterview = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary">Question {currentIndex + 1} of {interviewQuestions.length}</h4>
        <Badge bg="dark" className="px-3 py-2 rounded-pill">Voice AI Active</Badge>
      </div>
      
      <Card className="border-0 shadow-lg mb-4 glass-card p-4">
        <h2 className="fw-bold mb-4" style={{ lineHeight: '1.4' }}>{interviewQuestions[currentIndex]}</h2>
        
        <div className="bg-light rounded p-4 mb-4" style={{ minHeight: '150px', border: listening ? '2px solid #10b981' : '2px dashed #ccc' }}>
          {transcript ? (
            <p className="fs-5 text-dark mb-0">{transcript}</p>
          ) : (
            <p className="text-muted text-center mt-4">Click the microphone and start speaking your answer...</p>
          )}
        </div>

        <div className="d-flex justify-content-center gap-3">
          <Button 
            variant={listening ? "danger" : "primary"} 
            size="lg" 
            className="rounded-circle d-flex align-items-center justify-content-center shadow-lg hover-lift" 
            style={{ width: '70px', height: '70px' }}
            onClick={toggleListening}
            disabled={evaluating}
          >
            {listening ? <FiMicOff size={28} /> : <FiMic size={28} />}
          </Button>

          <Button 
            variant="success" 
            size="lg" 
            className="rounded-pill px-5 fw-bold shadow hover-lift d-flex align-items-center"
            onClick={submitAnswer}
            disabled={evaluating || !transcript.trim()}
          >
            {evaluating ? <Spinner size="sm" className="me-2" /> : <FiCheckCircle className="me-2" size={22} />}
            {evaluating ? 'Analyzing...' : 'Submit Answer'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const renderReport = () => {
    const avgTech = Math.round(evaluations.reduce((acc, curr) => acc + curr.evaluation.technicalScore, 0) / evaluations.length);
    const avgComm = Math.round(evaluations.reduce((acc, curr) => acc + curr.evaluation.communicationScore, 0) / evaluations.length);
    const avgConf = Math.round(evaluations.reduce((acc, curr) => acc + curr.evaluation.confidenceScore, 0) / evaluations.length);
    const overallScore = Math.round((avgTech * 0.5) + (avgComm * 0.3) + (avgConf * 0.2));

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold gradient-text">Interview Performance Report</h2>
          <p className="text-muted">Detailed analysis by your AI Coach</p>
        </div>

        <Row className="mb-5">
          <Col md={4}>
            <Card className="text-center p-4 border-0 shadow-sm glass-card h-100">
              <h1 className="display-3 fw-bold text-primary mb-0">{overallScore}%</h1>
              <p className="text-muted fw-semibold">Overall Readiness</p>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="p-4 border-0 shadow-sm glass-card h-100 justify-content-center">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1"><small className="fw-bold">Technical Accuracy</small><small>{avgTech}%</small></div>
                <ProgressBar variant="success" now={avgTech} style={{ height: '8px' }} />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1"><small className="fw-bold">Communication & Clarity</small><small>{avgComm}%</small></div>
                <ProgressBar variant="primary" now={avgComm} style={{ height: '8px' }} />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1"><small className="fw-bold">Confidence Delivery</small><small>{avgConf}%</small></div>
                <ProgressBar variant="warning" now={avgConf} style={{ height: '8px' }} />
              </div>
            </Card>
          </Col>
        </Row>

        <h4 className="fw-bold mb-4">Question Breakdown</h4>
        {evaluations.map((ev, index) => (
          <Card key={index} className="border-0 shadow-sm mb-4 glass-card p-4">
            <h5 className="fw-bold mb-3">Q{index + 1}: {ev.question}</h5>
            <div className="bg-light p-3 rounded mb-3">
              <p className="fst-italic text-muted mb-0">"{ev.answer}"</p>
            </div>
            <Row className="mb-3">
              <Col xs={4} className="text-center"><Badge bg="success" className="px-3 py-2 w-100">Tech: {ev.evaluation.technicalScore}</Badge></Col>
              <Col xs={4} className="text-center"><Badge bg="primary" className="px-3 py-2 w-100">Comm: {ev.evaluation.communicationScore}</Badge></Col>
              <Col xs={4} className="text-center"><Badge bg="warning" className="px-3 py-2 text-dark w-100">Conf: {ev.evaluation.confidenceScore}</Badge></Col>
            </Row>
            <div className="border-start border-4 border-primary ps-3">
              <p className="fw-semibold text-dark mb-0">{ev.evaluation.feedback}</p>
            </div>
          </Card>
        ))}

        <div className="text-center mt-5">
          <Button variant="outline-primary" className="rounded-pill px-5 fw-bold" onClick={() => setMode('setup')}>Start Another Session</Button>
        </div>
      </motion.div>
    );
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <AnimatePresence mode="wait">
        {mode === 'setup' && renderSetup()}
        {mode === 'overview' && renderOverview()}
        {mode === 'interview' && renderInterview()}
        {mode === 'report' && renderReport()}
      </AnimatePresence>
    </Container>
  );
};

export default InterviewAssistant;
