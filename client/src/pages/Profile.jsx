import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setSkills(user.skills?.join(', ') || '');
      setGithub(user.github || '');
      setLinkedin(user.linkedin || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('skills', skills);
      formData.append('github', github);
      formData.append('linkedin', linkedin);
      if (resume) {
        formData.append('resume', resume);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.put('http://localhost:5000/api/user/profile', formData, config);
      toast.success('Profile updated successfully!');
      
      // Update local storage
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      // Usually, we'd trigger a context refresh here or reload
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) return <Container className="mt-5 text-center"><h4>Please login</h4></Container>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="glass-card border-0 shadow-sm p-4">
              <Card.Body>
                <h3 className="fw-bold gradient-text mb-4">My Profile</h3>
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-light border-0 p-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-light border-0 p-2" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Skills (Comma separated)</Form.Label>
                    <Form.Control type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, MongoDB" className="bg-light border-0 p-2" />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>GitHub URL</Form.Label>
                        <Form.Control type="url" value={github} onChange={(e) => setGithub(e.target.value)} className="bg-light border-0 p-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>LinkedIn URL</Form.Label>
                        <Form.Control type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="bg-light border-0 p-2" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Resume (PDF, DOCX)</Form.Label>
                    <Form.Control type="file" onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" className="bg-light border-0 p-2" />
                    {user.resume && (
                      <div className="mt-2 text-muted small">
                        Current Resume: <a href={`http://localhost:5000${user.resume}`} target="_blank" rel="noreferrer">View File</a>
                      </div>
                    )}
                  </Form.Group>

                  <Button variant="primary" type="submit" className="px-5 py-2 rounded-pill fw-bold hover-lift">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Profile;
