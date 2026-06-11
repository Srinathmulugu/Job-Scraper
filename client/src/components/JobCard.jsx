import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiBookmark } from 'react-icons/fi';

const JobCard = ({ job, onSave }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="glass-card mb-4 border-0 shadow-sm hover-lift">
        <Card.Body className="p-4">
          <Row>
            <Col xs={12} md={9}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="fw-bold mb-0 text-primary">{job.title}</h4>
                <Badge bg="info" text="dark" className="rounded-pill d-md-none">{job.sourceWebsite}</Badge>
              </div>
              <h6 className="text-muted mb-3 fs-5">{job.company}</h6>
              
              <div className="d-flex flex-wrap gap-3 mb-3 text-secondary">
                <span className="d-flex align-items-center"><FiMapPin className="me-2" />{job.location || 'Not Specified'}</span>
                <span className="d-flex align-items-center"><FiBriefcase className="me-2" />{job.experience || 'Experience Not Listed'}</span>
                <span className="d-flex align-items-center"><FiDollarSign className="me-2" />{job.salary || 'Salary Not Disclosed'}</span>
                <span className="d-flex align-items-center"><FiClock className="me-2" />{job.jobType || 'Full-Time'}</span>
              </div>

              <div className="mb-3">
                {job.skills && job.skills.map((skill, index) => (
                  <Badge bg="secondary" className="me-2 mb-2 rounded-pill fw-normal" key={index}>{skill}</Badge>
                ))}
              </div>
              <div className="d-flex align-items-center mt-2">
                 <Badge bg="light" text="dark" className="border me-2">{job.workMode}</Badge>
                 <span className="text-muted small">Posted: {new Date(job.postedDate || Date.now()).toLocaleDateString()}</span>
              </div>
            </Col>
            
            <Col xs={12} md={3} className="d-flex flex-column justify-content-between align-items-md-end mt-3 mt-md-0">
              <Badge bg="info" text="dark" className="rounded-pill d-none d-md-block mb-3 px-3 py-2">{job.sourceWebsite}</Badge>
              
              <div className="d-flex flex-md-column flex-row gap-2 w-100">
                <Button 
                  variant="primary" 
                  className="rounded-pill w-100 fw-bold"
                  href={job.applyLink}
                  target="_blank"
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="rounded-pill w-100 d-flex justify-content-center align-items-center"
                  onClick={() => onSave(job._id)}
                >
                  <FiBookmark className="me-2" /> Save Job
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default JobCard;
