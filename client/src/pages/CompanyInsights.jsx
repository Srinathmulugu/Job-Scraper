import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiStar, FiUsers, FiTrendingUp, FiSearch } from 'react-icons/fi';

const mockCompanies = [
  { name: 'Google', rating: 4.5, employees: '100k+', hiring: 'High', tech: ['React', 'Python', 'Go'], salary: '₹20-40 LPA' },
  { name: 'Microsoft', rating: 4.4, employees: '150k+', hiring: 'Medium', tech: ['C#', 'React', 'Azure'], salary: '₹18-35 LPA' },
  { name: 'Amazon', rating: 4.2, employees: '1M+', hiring: 'Very High', tech: ['Java', 'AWS', 'Node'], salary: '₹15-30 LPA' },
  { name: 'TCS', rating: 3.9, employees: '600k+', hiring: 'Mass Hiring', tech: ['Java', 'Angular', 'SQL'], salary: '₹4-12 LPA' },
];

const CompanyInsights = () => {
  const [search, setSearch] = useState('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-5">
        <Row className="mb-5">
          <Col md={8} className="mx-auto text-center">
            <h2 className="fw-bold gradient-text mb-3">Company Insights</h2>
            <p className="text-muted mb-4">Discover ratings, salary ranges, and hiring trends of top companies.</p>
            <div className="position-relative">
               <FiSearch className="position-absolute text-muted" style={{ top: '15px', left: '20px' }} size={20} />
               <Form.Control 
                 type="text" 
                 placeholder="Search for a company..." 
                 className="rounded-pill px-5 py-3 shadow-sm border-0 bg-light"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </Col>
        </Row>

        <Row>
          {mockCompanies.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((company, idx) => (
            <Col md={6} lg={4} className="mb-4" key={idx}>
              <motion.div whileHover={{ y: -5 }}>
                <Card className="glass-card shadow-sm border-0 h-100 p-3 hover-lift">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="fw-bold mb-0 text-primary">{company.name}</h4>
                      <Badge bg="warning" text="dark" className="d-flex align-items-center px-2 py-1"><FiStar className="me-1" /> {company.rating}</Badge>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-2">
                       <span><FiUsers className="me-2"/>Employees:</span>
                       <span className="fw-semibold text-dark">{company.employees}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-2">
                       <span><FiTrendingUp className="me-2"/>Hiring Trend:</span>
                       <span className={`fw-semibold ${company.hiring.includes('High') ? 'text-success' : 'text-primary'}`}>{company.hiring}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-3">
                       <span>Average Salary:</span>
                       <span className="fw-bold text-dark">{company.salary}</span>
                    </div>
                    <hr/>
                    <div className="mt-3">
                      <span className="text-muted small d-block mb-2">Tech Stack:</span>
                      {company.tech.map(t => <Badge key={t} bg="light" text="dark" className="me-2 border fw-normal">{t}</Badge>)}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </motion.div>
  );
};

export default CompanyInsights;
