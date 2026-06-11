import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiDownload, FiEdit3 } from 'react-icons/fi';

const ResumeBuilder = () => {
  const [data, setData] = useState({
    name: 'John Doe',
    role: 'Full Stack Developer',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    summary: 'Passionate software engineer with 3+ years of experience building scalable web applications using React and Node.js. Adept at finding creative solutions to complex problems.',
    experience: 'Software Engineer at Google\n- Built highly scalable RESTful APIs serving 1M+ users daily\n- Improved page load time by 40% through lazy loading and caching\n\nFrontend Developer at Startup\n- Developed responsive user interfaces using React and Bootstrap\n- Collaborated with UX designers to implement pixel-perfect designs',
    education: 'B.S. Computer Science\nUniversity of Technology (2018-2022)'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-5 print-container">
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .resume-preview, .resume-preview * { visibility: visible; }
              .resume-preview { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; padding: 20px !important; }
              .no-print { display: none !important; }
            }
          `}
        </style>
        
        <Row className="mb-5 no-print text-center">
          <Col>
            <h2 className="fw-bold gradient-text">Resume Builder</h2>
            <p className="text-muted">Fill out your details and generate a clean, ATS-friendly PDF resume instantly.</p>
          </Col>
        </Row>

        <Row>
          <Col lg={5} className="mb-4 no-print">
            <Card className="glass-card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4"><FiEdit3 className="me-2"/>Edit Details</h5>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">Full Name</Form.Label>
                      <Form.Control type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">Role</Form.Label>
                      <Form.Control type="text" value={data.role} onChange={(e) => setData({...data, role: e.target.value})} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">Email</Form.Label>
                      <Form.Control type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small">Phone</Form.Label>
                      <Form.Control type="text" value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Professional Summary</Form.Label>
                  <Form.Control as="textarea" rows={3} value={data.summary} onChange={(e) => setData({...data, summary: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Experience (New lines for bullet points)</Form.Label>
                  <Form.Control as="textarea" rows={6} value={data.experience} onChange={(e) => setData({...data, experience: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small">Education</Form.Label>
                  <Form.Control as="textarea" rows={3} value={data.education} onChange={(e) => setData({...data, education: e.target.value})} />
                </Form.Group>
                <Button variant="primary" className="w-100 rounded-pill hover-lift py-2 fw-bold" onClick={handlePrint}>
                  <FiDownload className="me-2"/> Export as PDF
                </Button>
              </Form>
            </Card>
          </Col>

          <Col lg={7} className="mb-4">
            <Card className="border-0 shadow-lg p-5 bg-white resume-preview h-100" style={{ minHeight: '800px', fontFamily: 'Arial, sans-serif' }}>
              <div className="text-center mb-4 border-bottom pb-4">
                <h1 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '2px' }}>{data.name.toUpperCase()}</h1>
                <h5 className="text-muted mb-2">{data.role}</h5>
                <small className="text-dark">{data.email} | {data.phone}</small>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3 text-dark" style={{ letterSpacing: '1px' }}>Summary</h6>
                <p className="text-dark mb-0">{data.summary}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3 text-dark" style={{ letterSpacing: '1px' }}>Experience</h6>
                <div className="text-dark" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{data.experience}</div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3 text-dark" style={{ letterSpacing: '1px' }}>Education</h6>
                <div className="text-dark" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{data.education}</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default ResumeBuilder;
