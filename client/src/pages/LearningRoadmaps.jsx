import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiMap, FiCheckCircle, FiCircle } from 'react-icons/fi';

const roadmaps = [
  {
    title: 'MERN Stack Developer',
    description: 'Master MongoDB, Express, React, and Node.js to build full-stack web applications.',
    steps: [
      { name: 'HTML, CSS & JavaScript Fundamentals', done: true },
      { name: 'React Hooks, Context API & Redux', done: true },
      { name: 'Node.js & Express API Development', done: false },
      { name: 'MongoDB & Mongoose Data Modeling', done: false },
      { name: 'Authentication (JWT, OAuth)', done: false },
    ]
  },
  {
    title: 'Data Science & AI',
    description: 'Learn Python, Pandas, Scikit-Learn, and Deep Learning to become a Data Scientist.',
    steps: [
      { name: 'Python Basics & NumPy', done: true },
      { name: 'Data Manipulation with Pandas', done: false },
      { name: 'Machine Learning (Scikit-Learn)', done: false },
      { name: 'Deep Learning (TensorFlow/PyTorch)', done: false },
    ]
  }
];

const LearningRoadmaps = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold gradient-text">Learning Roadmaps</h2>
          <p className="text-muted">Follow these structured paths to master high-paying tech skills.</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Accordion defaultActiveKey="0" className="shadow-sm">
              {roadmaps.map((r, i) => (
                <Accordion.Item eventKey={i.toString()} key={i} className="border-0 mb-3 rounded overflow-hidden glass-card shadow-sm">
                  <Accordion.Header>
                    <div className="d-flex align-items-center">
                      <FiMap className="text-primary me-3" size={24} />
                      <div>
                        <h5 className="mb-0 fw-bold">{r.title}</h5>
                        <small className="text-muted fw-normal">{r.description}</small>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="bg-light">
                    <div className="roadmap-steps position-relative ps-4 py-2" style={{ borderLeft: '2px solid #dee2e6', marginLeft: '10px' }}>
                      {r.steps.map((step, idx) => (
                        <div key={idx} className="mb-4 position-relative">
                          <div className="position-absolute bg-light" style={{ left: '-29px', top: '2px' }}>
                            {step.done ? <FiCheckCircle className="text-success" size={20}/> : <FiCircle className="text-muted" size={20}/>}
                          </div>
                          <h6 className={`mb-1 fw-bold ${step.done ? 'text-success' : 'text-dark'}`}>{step.name}</h6>
                          <small className="text-muted">{step.done ? 'Completed! Great job.' : 'Pending module.'}</small>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default LearningRoadmaps;
