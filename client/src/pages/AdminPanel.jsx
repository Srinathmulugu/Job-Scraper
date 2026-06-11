import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const resStats = await axios.get('http://localhost:5000/api/admin/stats', config);
      setStats(resStats.data);

      const resUsers = await axios.get('http://localhost:5000/api/admin/users', config);
      setUsers(resUsers.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    }
  };

  const handleTriggerScrapers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      toast.success('Scrapers triggered successfully. Check logs.');
      await axios.post('http://localhost:5000/api/admin/trigger-scrapers', {}, config);
    } catch (error) {
      toast.error('Failed to trigger scrapers');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Container className="mt-5 text-center"><h4>Not authorized as an admin</h4></Container>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold gradient-text">Admin Panel</h2>
              <p className="text-muted">Manage users, view system statistics, and monitor scrapers.</p>
            </div>
            <Button variant="outline-primary" onClick={handleTriggerScrapers} className="rounded-pill hover-lift">
              Run Scrapers Now
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="glass-card text-center p-3 mb-3 border-0">
              <Card.Body>
                <h4>{stats.totalUsers || 0}</h4>
                <p className="text-muted mb-0">Registered Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-card text-center p-3 mb-3 border-0">
              <Card.Body>
                <h4>{stats.totalJobs || 0}</h4>
                <p className="text-muted mb-0">Total Jobs Aggregated</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-card text-center p-3 mb-3 border-0">
              <Card.Body>
                <h4>{stats.totalApplications || 0}</h4>
                <p className="text-muted mb-0">Total Applications Tracked</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="glass-card p-4 border-0">
              <h5 className="fw-bold mb-4">User Management</h5>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <Badge bg={u.role === 'admin' ? 'danger' : 'primary'}>{u.role}</Badge>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                          <Button variant="outline-danger" size="sm">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default AdminPanel;
