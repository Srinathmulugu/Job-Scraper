import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiMapPin } from 'react-icons/fi';
import axios from 'axios';

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch live job count
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setTotalJobs(res.data.totalJobs))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm) {
      navigate(`/jobs`);
      // Since context is global, we can navigate there and user can search. To pass search term we can use query params or just let them search on the page.
      // Better approach: pass state.
      navigate('/jobs', { state: { role: searchTerm } });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="landing-wrapper">
      <Container className="py-5 mt-5 position-relative">
        
        {/* Floating Background Elements */}
        <div className="bg-shape bg-primary opacity-25 position-absolute rounded-circle blur-blob" style={{ width: '300px', height: '300px', top: '-10%', left: '-5%', filter: 'blur(80px)', zIndex: -1 }}></div>
        <div className="bg-shape bg-info opacity-25 position-absolute rounded-circle blur-blob" style={{ width: '400px', height: '400px', top: '20%', right: '-10%', filter: 'blur(100px)', zIndex: -1 }}></div>

        <Row className="justify-content-center text-center">
          <Col md={10} lg={8}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
              <Badge bg="primary" className="rounded-pill mb-3 px-3 py-2 fw-normal">
                ✨ SkillSphere AI Ecosystem
              </Badge>
            </motion.div>
            <motion.h1 
              className="display-3 fw-bold mb-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            >
              Accelerate Your Career with <br/>
              <span className="gradient-text">Job Scraper</span>
            </motion.h1>
            <motion.p 
              className="lead mb-5 text-muted px-md-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              The premium All-In-One Career Ecosystem. Aggregate jobs, track applications, analyze resumes, and prepare for interviews using AI.
            </motion.p>
            
            {/* Animated Search Bar */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <Card className="glass-card rounded-pill p-2 shadow-sm border-primary border-opacity-25">
                <Form onSubmit={handleSearch} className="d-flex align-items-center">
                  <FiSearch className="text-muted ms-3 fs-5" />
                  <Form.Control 
                    type="text" 
                    placeholder="Search by role, company, or skills..." 
                    className="border-0 bg-transparent shadow-none ms-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary" type="submit" className="rounded-pill px-4 hover-lift">Search</Button>
                </Form>
              </Card>
            </motion.div>

            {/* Trending Keywords */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-muted small">
              <span className="fw-semibold me-2">Trending:</span>
              {['React', 'Node.js', 'Python', 'AWS', 'Remote', 'Data Science'].map(kw => (
                <Badge key={kw} bg="light" text="dark" className="border me-2 rounded-pill fw-normal cursor-pointer hover-lift">
                  {kw}
                </Badge>
              ))}
            </motion.div>
          </Col>
        </Row>

        {/* Live Counter & Company Logos */}
        <Row className="mt-5 pt-4 text-center justify-content-center">
          <Col md={8}>
            <p className="text-muted mb-4 fw-semibold text-uppercase tracking-wider fs-7">
              Trusted by professionals applying to
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-4 opacity-50 filter-grayscale company-logos">
               <h3 className="fw-bold">Google</h3>
               <h3 className="fw-bold">Microsoft</h3>
               <h3 className="fw-bold">Amazon</h3>
               <h3 className="fw-bold">TCS</h3>
               <h3 className="fw-bold">Infosys</h3>
            </div>
          </Col>
        </Row>

        <Row className="mt-5 pt-5">
          <Col md={4} className="mb-4">
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }} className="h-100">
              <Card className="glass-card text-center h-100 p-4 border-0 shadow-sm position-relative overflow-hidden">
                <Card.Body className="position-relative" style={{ zIndex: 1 }}>
                  <motion.h2 
                    className="fw-bold display-4 mb-3 gradient-text"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.5 }}
                  >
                    {totalJobs}+
                  </motion.h2>
                  <Card.Text className="text-muted fw-semibold fs-5">Live Jobs Aggregated</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={4} className="mb-4">
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }}>
              <Card className="glass-card text-center h-100 p-4 border-0 shadow-sm relative overflow-hidden">
                <Card.Body>
                  <Card.Title className="fw-bold fs-3 mb-3">AI Intelligence</Card.Title>
                  <Card.Text className="text-muted">Resume analysis, ATS scoring, and dynamic interview prep.</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={4} className="mb-4">
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }}>
              <Card className="glass-card text-center h-100 p-4 border-0 shadow-sm relative overflow-hidden">
                <Card.Body>
                  <Card.Title className="fw-bold fs-3 mb-3">Smart Tracking</Card.Title>
                  <Card.Text className="text-muted">Trello-style Kanban board to seamlessly manage applications.</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Floating Cards Example */}
        <div className="d-none d-lg-block position-absolute" style={{ top: '15%', left: '0%', transform: 'rotate(-5deg)' }}>
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
            <Card className="glass-card p-3 shadow-lg border-0" style={{ width: '220px' }}>
              <h6 className="fw-bold text-primary"><FiBriefcase className="me-2"/> Frontend Dev</h6>
              <small className="text-muted">React, Redux, Node</small>
            </Card>
          </motion.div>
        </div>
        <div className="d-none d-lg-block position-absolute" style={{ top: '40%', right: '0%', transform: 'rotate(5deg)' }}>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
            <Card className="glass-card p-3 shadow-lg border-0" style={{ width: '220px' }}>
               <h6 className="fw-bold text-success"><FiMapPin className="me-2"/> Remote Work</h6>
               <small className="text-muted">₹12 - 18 LPA</small>
            </Card>
          </motion.div>
        </div>

      </Container>
    </motion.div>
  );
};

export default Landing;
