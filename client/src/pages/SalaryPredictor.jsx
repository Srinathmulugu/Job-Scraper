import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const SalaryPredictor = () => {
  const [formData, setFormData] = useState({ role: '', experience: '0-2', location: '' });
  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);

  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      let base = 6;
      if (formData.experience === '3-5') base += 5;
      if (formData.experience === '5+') base += 12;
      if (formData.location.toLowerCase().includes('bangalore') || formData.location.toLowerCase().includes('us')) base += 4;
      if (formData.role.toLowerCase().includes('senior') || formData.role.toLowerCase().includes('data')) base += 5;

      setPrediction({
        min: base,
        max: base + 4,
        avg: base + 2
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Container className="py-5">
        <h2 className="fw-bold gradient-text mb-4 text-center">AI Salary Predictor</h2>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="glass-card shadow-lg border-0 p-4 mb-4">
              <Form onSubmit={handlePredict}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Job Role</Form.Label>
                  <Form.Control type="text" placeholder="e.g. React Developer" required onChange={(e) => setFormData({...formData, role: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Experience Level</Form.Label>
                  <Form.Select onChange={(e) => setFormData({...formData, experience: e.target.value})}>
                    <option value="0-2">Entry Level (0-2 years)</option>
                    <option value="3-5">Mid Level (3-5 years)</option>
                    <option value="5+">Senior Level (5+ years)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Bangalore" required onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 rounded-pill hover-lift py-2 fw-bold">
                  Predict Salary
                </Button>
              </Form>
            </Card>

            {loading && (
              <Card className="glass-card border-0 shadow-sm p-4 h-100 d-flex align-items-center justify-content-center ai-pulse-loader mb-4">
                 <div className="text-center">
                   <div className="mb-3">
                     <FiTrendingUp size={40} className="text-primary pulse-icon" />
                   </div>
                   <h5 className="text-primary fw-bold gradient-text">Calculating Market Value...</h5>
                   <p className="text-muted small">Cross-referencing global salary indices</p>
                 </div>
              </Card>
            )}

            {prediction && !loading && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Card className="border-0 shadow-lg p-4 bg-primary text-white text-center rounded-4 overflow-hidden relative">
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-10" style={{ pointerEvents: 'none' }}></div>
                  <FiDollarSign size={40} className="mb-3 opacity-75" />
                  <h5 className="fw-semibold mb-2">Estimated Market Value</h5>
                  <h1 className="fw-bold display-4 mb-3">₹{prediction.min} - {prediction.max} LPA</h1>
                  <p className="mb-4 opacity-75">Based on real-time data for <strong>{formData.role}</strong> in <strong>{formData.location}</strong>.</p>
                  
                  <div className="text-start">
                     <small className="opacity-75">Confidence Score</small>
                     <ProgressBar variant="success" now={85} className="mt-1" style={{ height: '6px' }} />
                  </div>
                </Card>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default SalaryPredictor;
