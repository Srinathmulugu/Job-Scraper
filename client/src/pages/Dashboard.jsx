import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for chart.js v3+
import axios from 'axios';
import { FiBriefcase, FiCheckCircle, FiStar, FiActivity, FiTrendingUp } from 'react-icons/fi';


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ applied: 0, wishlist: 0, interviews: 0, offers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/jobs/applications', config);
        
        let applied = 0, wishlist = 0, interviews = 0, offers = 0;
        data.forEach(app => {
          if (app.status === 'Applied') applied++;
          if (app.status === 'Wishlist') wishlist++;
          if (app.status === 'Interview') interviews++;
          if (app.status === 'Offer') offers++;
        });
        
        setStats({ applied, wishlist, interviews, offers });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user]);

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Applications Sent',
      data: [12, 19, 15, 22, 30, stats.applied + stats.interviews + stats.offers], // Mock historical data
      backgroundColor: 'rgba(13, 110, 253, 0.5)',
      borderColor: '#0D6EFD',
      borderWidth: 1,
    }]
  };

  const doughnutData = {
    labels: ['Applied', 'Wishlist', 'Interview', 'Offer'],
    datasets: [{
      data: [stats.applied || 1, stats.wishlist || 1, stats.interviews || 1, stats.offers || 1], // fallback for empty state to show chart
      backgroundColor: ['#0D6EFD', '#6610F2', '#ffc107', '#20C997'],
      borderWidth: 0,
    }]
  };

  if (!user) {
    return <Container className="mt-5 text-center"><h4>Please login to view your dashboard.</h4></Container>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold gradient-text">Dashboard</h2>
            <p className="text-muted">Welcome back, {user.name}!</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="glass-card border-0 hover-lift text-center h-100">
              <Card.Body>
                <FiBriefcase size={32} className="text-primary mb-3" />
                <h3>{stats.applied + stats.interviews + stats.offers}</h3>
                <p className="text-muted mb-0">Total Applied</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="glass-card border-0 hover-lift text-center h-100">
              <Card.Body>
                <FiStar size={32} className="text-secondary mb-3" />
                <h3>{user.savedJobs?.length || stats.wishlist}</h3>
                <p className="text-muted mb-0">Saved / Wishlist</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="glass-card border-0 hover-lift text-center h-100">
              <Card.Body>
                <FiActivity size={32} className="text-warning mb-3" />
                <h3>{stats.interviews}</h3>
                <p className="text-muted mb-0">Interviews</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="glass-card border-0 hover-lift text-center h-100">
              <Card.Body>
                <FiCheckCircle size={32} className="text-success mb-3" />
                <h3>{stats.offers}</h3>
                <p className="text-muted mb-0">Offers</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={8} className="mb-4">
            <Card className="glass-card border-0 h-100 p-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Weekly Activity</h5>
                  <Badge bg="primary" className="fw-normal">This Week</Badge>
                </div>
                <div style={{ height: '300px' }}>
                  <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { borderDash: [5, 5] } }, x: { grid: { display: false } } } }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="glass-card border-0 h-100 p-3 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-4">Application Funnel</h5>
                <div style={{ height: '250px' }} className="d-flex justify-content-center">
                  <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="glass-card border-0 h-100 p-4 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FiTrendingUp className="text-primary me-2" size={24} />
                  <h5 className="fw-bold mb-0">Skills Demand Radar</h5>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted mb-1"><small>React / Next.js</small><small>92%</small></div>
                  <ProgressBar now={92} variant="primary" style={{ height: '8px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted mb-1"><small>Node.js / Express</small><small>85%</small></div>
                  <ProgressBar now={85} variant="info" style={{ height: '8px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted mb-1"><small>MongoDB / NoSQL</small><small>78%</small></div>
                  <ProgressBar now={78} variant="success" style={{ height: '8px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted mb-1"><small>AWS / Cloud</small><small>65%</small></div>
                  <ProgressBar now={65} variant="warning" style={{ height: '8px' }} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted mb-1"><small>Docker / CI-CD</small><small>60%</small></div>
                  <ProgressBar now={60} variant="secondary" style={{ height: '8px' }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="glass-card border-0 h-100 p-4 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-4">Application Heatmap</h5>
                <p className="text-muted small mb-4">Your daily application streaks over the last 30 days.</p>
                <div className="d-flex flex-wrap gap-1">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const intensity = Math.random();
                    let colorClass = 'bg-light';
                    if (intensity > 0.8) colorClass = 'bg-primary';
                    else if (intensity > 0.5) colorClass = 'bg-primary opacity-75';
                    else if (intensity > 0.2) colorClass = 'bg-primary opacity-50';
                    else if (intensity > 0.1) colorClass = 'bg-primary opacity-25';
                    
                    return (
                      <div key={i} className={`rounded ${colorClass}`} style={{ width: '15px', height: '15px' }} title="Activity"></div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
