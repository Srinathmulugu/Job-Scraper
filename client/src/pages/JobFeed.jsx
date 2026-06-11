import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { JobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobFeed = () => {
  const { jobs, loading, fetchJobs } = useContext(JobContext);
  const { user } = useContext(AuthContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [jobTypeFilters, setJobTypeFilters] = useState([]);

  useEffect(() => {
    fetchJobs({ limit: 50 });
  }, []);

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    fetchJobs({ role: searchTerm, workMode: filterMode, jobType: jobTypeFilters.join(','), limit: 50 });
  };

  const handleCheckboxChange = (type) => {
    let updatedFilters = [...jobTypeFilters];
    if (updatedFilters.includes(type)) {
      updatedFilters = updatedFilters.filter(item => item !== type);
    } else {
      updatedFilters.push(type);
    }
    setJobTypeFilters(updatedFilters);
    // Automatically trigger search when checkbox changes
    fetchJobs({ role: searchTerm, workMode: filterMode, jobType: updatedFilters.join(','), limit: 50 });
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      toast.error('Please login to save jobs');
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.post('http://localhost:5000/api/jobs/save', { jobId }, config);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold gradient-text">Explore Opportunities</h2>
            <p className="text-muted">Find the best roles aggregated from top platforms.</p>
          </Col>
        </Row>
        
        <Row className="mb-5">
          <Col md={12}>
            <Form onSubmit={handleSearch} className="d-flex gap-3 glass-card p-3 rounded">
              <Form.Control 
                type="text" 
                placeholder="Search by role, title, or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-light border-0"
              />
              <Form.Select 
                className="bg-light border-0 w-auto" 
                value={filterMode} 
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value="">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </Form.Select>
              <Button variant="primary" type="submit" className="px-4 rounded fw-bold">Search</Button>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col md={3} className="d-none d-md-block">
            {/* Additional Advanced Filters can go here */}
            <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3">Filters</h5>
              <hr />
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Job Type</Form.Label>
                <Form.Check type="checkbox" label="Full-Time" checked={jobTypeFilters.includes('Full-time')} onChange={() => handleCheckboxChange('Full-time')} />
                <Form.Check type="checkbox" label="Part-Time" checked={jobTypeFilters.includes('Part-time')} onChange={() => handleCheckboxChange('Part-time')} />
                <Form.Check type="checkbox" label="Contract" checked={jobTypeFilters.includes('Contract')} onChange={() => handleCheckboxChange('Contract')} />
                <Form.Check type="checkbox" label="Internship" checked={jobTypeFilters.includes('Internship')} onChange={() => handleCheckboxChange('Internship')} />
              </Form.Group>
              <Button variant="outline-primary" className="w-100" onClick={() => {
                setSearchTerm(''); setFilterMode(''); setJobTypeFilters([]);
                fetchJobs({ limit: 50 });
              }}>Clear Filters</Button>
            </div>
          </Col>
          <Col md={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Fetching jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-5 glass-card">
                <h4 className="text-muted">No jobs found matching your criteria.</h4>
                <Button variant="link" onClick={() => fetchJobs()}>Reset Search</Button>
              </div>
            ) : (
              jobs.map(job => (
                <JobCard key={job._id} job={job} onSave={handleSaveJob} />
              ))
            )}
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default JobFeed;
