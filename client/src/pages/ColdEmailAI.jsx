import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiSend, FiCopy } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ColdEmailAI = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ recipientName: '', companyName: '', jobRole: '', myResumeSummary: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobRole || !formData.myResumeSummary) return toast.error('Required fields are missing');
    
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/ai/email', formData, config);
      setResult(data);
      toast.success('Copy generated successfully!');
    } catch (error) {
      toast.error('Failed to generate outreach copy');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-5">
        <div className="text-center mb-5">
          <Badge bg="primary" className="mb-2 px-3 py-2 fw-normal rounded-pill">Powered by OpenAI GPT-4o</Badge>
          <h2 className="fw-bold gradient-text">AI Outreach Generator</h2>
          <p className="text-muted">Instantly draft highly personalized cold emails and LinkedIn messages to recruiters.</p>
        </div>

        <Row>
          <Col lg={5} className="mb-4">
            <Card className="glass-card border-0 shadow-sm p-4 h-100">
              <Form onSubmit={handleGenerate} className="d-flex flex-column h-100">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Recruiter/Hiring Manager Name (Optional)</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Sarah Smith" onChange={(e) => setFormData({...formData, recipientName: e.target.value})} />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">Company Name</Form.Label>
                      <Form.Control type="text" placeholder="e.g. Stripe" required onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">Target Role</Form.Label>
                      <Form.Control type="text" placeholder="e.g. Frontend Engineer" required onChange={(e) => setFormData({...formData, jobRole: e.target.value})} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4 flex-grow-1">
                  <Form.Label className="fw-semibold small">Your Resume / Background Summary</Form.Label>
                  <Form.Control as="textarea" rows={6} placeholder="Paste your core skills or brief summary here so the AI can weave it into the pitch..." required onChange={(e) => setFormData({...formData, myResumeSummary: e.target.value})} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="w-100 py-3 rounded-pill fw-bold hover-lift">
                  {loading ? 'Generating...' : <><FiSend className="me-2"/> Generate Outreach Copy</>}
                </Button>
              </Form>
            </Card>
          </Col>

          <Col lg={7} className="mb-4">
            {!result && !loading && (
              <Card className="glass-card border-0 shadow-sm p-4 h-100 d-flex align-items-center justify-content-center text-muted">
                <div className="text-center">
                  <FiMail size={48} className="mb-3 opacity-50 text-primary" />
                  <h5>Awaiting Details</h5>
                  <p>Provide your target company and background to generate hyper-personalized copy.</p>
                </div>
              </Card>
            )}

            {loading && (
              <Card className="glass-card border-0 shadow-sm p-4 h-100 d-flex align-items-center justify-content-center ai-pulse-loader">
                 <div className="text-center">
                   <div className="mb-3">
                     <FiMail size={40} className="text-primary pulse-icon" />
                   </div>
                   <h5 className="text-primary fw-bold gradient-text">Drafting personalized pitch...</h5>
                   <p className="text-muted small">Weaving your background into the target job profile</p>
                 </div>
              </Card>
            )}

            {result && !loading && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-100 d-flex flex-column">
                
                {/* Email Card */}
                <Card className="border-0 shadow-sm p-4 mb-4 bg-white flex-grow-1 relative">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h5 className="fw-bold text-dark mb-0"><FiMail className="me-2 text-primary"/> Cold Email</h5>
                    <Button variant="light" size="sm" onClick={() => copyToClipboard(`Subject: ${result.subject}\n\n${result.emailBody}`)}><FiCopy /></Button>
                  </div>
                  <div className="mb-2"><small className="text-muted">Subject:</small> <span className="fw-bold text-dark">{result.subject}</span></div>
                  <div className="text-dark bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{result.emailBody}</div>
                </Card>

                {/* LinkedIn Card */}
                <Card className="border-0 shadow-sm p-4 bg-white relative">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h5 className="fw-bold text-dark mb-0"><FiLinkedin className="me-2 text-primary"/> LinkedIn Connection Note</h5>
                    <Button variant="light" size="sm" onClick={() => copyToClipboard(result.linkedinMessage)}><FiCopy /></Button>
                  </div>
                  <div className="text-dark bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{result.linkedinMessage}</div>
                  <small className="text-muted mt-2 d-block text-end">{result.linkedinMessage.length}/300 chars</small>
                </Card>

              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default ColdEmailAI;
