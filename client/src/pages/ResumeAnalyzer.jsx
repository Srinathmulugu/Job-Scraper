import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiTarget } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ResumeAnalyzer = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ file: null, jobDescription: '' });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.jobDescription) return toast.error('Please upload a PDF and enter a Job Description');
    
    setLoading(true);
    try {
      const dataForm = new FormData();
      dataForm.append('resume', formData.file);
      dataForm.append('jobDescription', formData.jobDescription);

      const config = { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('http://localhost:5000/api/ai/resume/pdf', dataForm, config);
      setAnalysis(data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze resume');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-5">
        <div className="text-center mb-5">
          <Badge bg="primary" className="mb-2 px-3 py-2 fw-normal rounded-pill">Powered by OpenAI GPT-4o</Badge>
          <h2 className="fw-bold gradient-text">AI Resume Analyzer</h2>
          <p className="text-muted">Instantly score your resume against a job description to beat the ATS.</p>
        </div>

        <Row>
          <Col lg={6} className="mb-4">
            <Card className="glass-card border-0 shadow-sm p-4 h-100">
              <Form onSubmit={handleAnalyze} className="d-flex flex-column h-100">
                <Form.Group className="mb-4 flex-grow-1">
                  <Form.Label className="fw-semibold"><FiFileText className="me-2"/>Upload PDF Resume</Form.Label>
                  <Form.Control type="file" accept=".pdf" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
                  <Form.Text className="text-muted">Only .pdf format is supported.</Form.Text>
                </Form.Group>
                <Form.Group className="mb-4 flex-grow-1">
                  <Form.Label className="fw-semibold"><FiTarget className="me-2"/>Job Description</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Paste the target job description here..." onChange={(e) => setFormData({...formData, jobDescription: e.target.value})} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="w-100 py-3 rounded-pill fw-bold hover-lift">
                  {loading ? <Spinner size="sm" /> : 'Analyze Match Score'}
                </Button>
              </Form>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            {!analysis && !loading && (
              <Card className="glass-card border-0 shadow-sm p-4 h-100 d-flex align-items-center justify-content-center text-muted">
                <div className="text-center">
                  <FiCheckCircle size={48} className="mb-3 opacity-50" />
                  <h5>Awaiting Input</h5>
                  <p>Submit your resume to see your ATS score.</p>
                </div>
              </Card>
            )}

            {loading && (
              <Card className="glass-card border-0 shadow-sm p-4 h-100 d-flex align-items-center justify-content-center ai-pulse-loader">
                 <div className="text-center">
                   <div className="mb-3">
                     <FiTarget size={40} className="text-primary pulse-icon" />
                   </div>
                   <h5 className="text-primary fw-bold gradient-text">Extracting Exact N-Grams...</h5>
                   <p className="text-muted small">Cross-referencing resume footprint with JD requirements</p>
                 </div>
              </Card>
            )}

            {analysis && !loading && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-100">
                <Card className="border-0 shadow-lg p-4 h-100 bg-light">
                  <div className="text-center mb-4">
                    <h5 className="text-muted fw-bold">ATS Match Score</h5>
                    <div className="mt-3 mb-2">
                      <ProgressBar 
                        now={analysis.atsScore} 
                        label={`${analysis.atsScore}%`} 
                        variant={analysis.atsScore >= 80 ? 'success' : analysis.atsScore >= 50 ? 'warning' : 'danger'} 
                        style={{ height: '30px', fontSize: '16px', fontWeight: 'bold' }} 
                        className="rounded-pill"
                      />
                    </div>
                  </div>
                  
                  <h6 className="fw-bold mb-3"><FiAlertTriangle className="text-warning me-2"/>Missing Keywords</h6>
                  <div className="mb-4">
                    {analysis.missingKeywords.map(kw => (
                      <Badge key={kw} bg="danger" className="me-2 mb-2 px-3 py-2 rounded-pill fw-normal shadow-sm opacity-75">{kw}</Badge>
                    ))}
                  </div>

                  <h6 className="fw-bold mb-3"><FiCheckCircle className="text-success me-2"/>Actionable Suggestions</h6>
                  <ul className="text-muted small ps-3">
                    {analysis.suggestions.map((s, i) => <li key={i} className="mb-2">{s}</li>)}
                  </ul>
                </Card>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default ResumeAnalyzer;
