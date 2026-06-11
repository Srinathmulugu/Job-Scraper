import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, ProgressBar } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiBriefcase, FiMapPin, FiCalendar, FiDollarSign, FiZap } from 'react-icons/fi';

const COLUMNS = [
  { id: 'Wishlist', title: 'Wishlist', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'Applied', title: 'Applied', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { id: 'Assessment', title: 'Assessment', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  { id: 'Interview', title: 'Interview', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  { id: 'Offer', title: 'Offer', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'Rejected', title: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
];

const ApplicationTracker = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/jobs/applications', config);
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    }
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedApps = applications.map(app => {
      if (app._id === draggableId) return { ...app, status: newStatus };
      return app;
    });
    setApplications(updatedApps);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/jobs/applications/${draggableId}`, { status: newStatus }, config);
      toast.success(`Moved to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
      fetchApplications(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5 mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted fw-bold">Loading Kanban Board...</p>
      </Container>
    );
  }

  // Analytics Metrics
  const totalApplied = applications.filter(a => a.status !== 'Wishlist').length;
  const activeInterviews = applications.filter(a => a.status === 'Interview').length;
  const offers = applications.filter(a => a.status === 'Offer').length;
  const successRate = totalApplied > 0 ? Math.round((offers / totalApplied) * 100) : 0;
  const progressPercent = totalApplied > 0 ? Math.min(100, (offers / totalApplied) * 100 * 5) : 0; // Exaggerated for visual effect

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container fluid className="py-4 px-md-4" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
        
        {/* Header & Metrics Dashboard */}
        <div className="mb-4">
          <h2 className="fw-bold gradient-text mb-4">Career Control Center</h2>
          <Row className="g-3 mb-4">
            <Col md={3} xs={6}>
              <Card className="border-0 shadow-sm glass-card text-center p-3 h-100">
                <h2 className="fw-bold text-primary mb-0">{totalApplied}</h2>
                <small className="text-muted fw-bold">Applied Jobs</small>
              </Card>
            </Col>
            <Col md={3} xs={6}>
              <Card className="border-0 shadow-sm glass-card text-center p-3 h-100">
                <h2 className="fw-bold text-info mb-0">{activeInterviews}</h2>
                <small className="text-muted fw-bold">Interviews</small>
              </Card>
            </Col>
            <Col md={3} xs={6}>
              <Card className="border-0 shadow-sm glass-card text-center p-3 h-100">
                <h2 className="fw-bold text-success mb-0">{offers}</h2>
                <small className="text-muted fw-bold">Offers</small>
              </Card>
            </Col>
            <Col md={3} xs={6}>
              <Card className="border-0 shadow-sm glass-card text-center p-3 h-100">
                <h2 className="fw-bold text-warning mb-0">{successRate}%</h2>
                <small className="text-muted fw-bold">Success Rate</small>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm p-4 glass-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">Career Progress</h6>
              <Badge bg="dark" className="rounded-pill px-3 py-2">
                <FiZap className="me-1 text-warning"/> Optimization Needed
              </Badge>
            </div>
            <ProgressBar variant="success" now={progressPercent} className="rounded-pill" style={{ height: '10px' }} />
            <small className="text-muted mt-2 d-block">
              <strong>AI Suggestion:</strong> You have {totalApplied} applications but only {activeInterviews} interviews. Try optimizing your resume keywords or adding quantifiable metrics to improve your ATS conversion rate.
            </small>
          </Card>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Row className="g-3 h-100 pb-5 flex-nowrap flex-xl-wrap overflow-auto">
            {COLUMNS.map((col) => {
              const colApps = applications.filter(app => app.status === col.id);
              return (
                <Col key={col.id} xl={2} lg={4} md={6} xs={11} className="d-flex flex-column" style={{ minWidth: '280px' }}>
                  <div className="p-3 rounded h-100 d-flex flex-column" style={{ backgroundColor: col.bg, borderTop: `4px solid ${col.color}` }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0" style={{ color: col.color }}>{col.title} ({colApps.length})</h6>
                    </div>
                    
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex-grow-1"
                          style={{ minHeight: '200px', backgroundColor: snapshot.isDraggingOver ? 'rgba(255,255,255,0.5)' : 'transparent', transition: 'background-color 0.2s ease', borderRadius: '8px' }}
                        >
                          {colApps.map((app, index) => (
                            <Draggable key={app._id} draggableId={app._id} index={index}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3 border-0 shadow-sm glass-card"
                                  style={{
                                    ...provided.draggableProps.style,
                                    transform: snapshot.isDragging ? provided.draggableProps.style.transform : 'translate(0px, 0px)',
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                    boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.05)',
                                  }}
                                >
                                  <Card.Body className="p-3">
                                    <div className="d-flex align-items-center mb-2">
                                      <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2" 
                                        style={{ width: '32px', height: '32px', backgroundColor: col.color, fontSize: '14px' }}
                                      >
                                        {(app.jobId?.company || 'C')[0].toUpperCase()}
                                      </div>
                                      <div className="text-truncate">
                                        <h6 className="fw-bold text-truncate mb-0" style={{ fontSize: '14px' }}>{app.jobId?.title || 'Unknown Role'}</h6>
                                        <small className="text-muted text-truncate d-block" style={{ fontSize: '12px' }}>{app.jobId?.company || 'Unknown Company'}</small>
                                      </div>
                                    </div>
                                    
                                    <div className="d-flex flex-column gap-1 mt-3">
                                      {app.jobId?.location && (
                                        <div className="d-flex align-items-center text-muted" style={{ fontSize: '12px' }}>
                                          <FiMapPin className="me-2 text-danger"/> <span className="text-truncate">{app.jobId.location}</span>
                                        </div>
                                      )}
                                      {app.jobId?.salary && app.jobId.salary !== 'Not disclosed' && (
                                        <div className="d-flex align-items-center text-muted" style={{ fontSize: '12px' }}>
                                          <FiDollarSign className="me-2 text-success"/> <span className="text-truncate">{app.jobId.salary}</span>
                                        </div>
                                      )}
                                      <div className="d-flex align-items-center text-muted" style={{ fontSize: '12px' }}>
                                        <FiCalendar className="me-2 text-primary"/> Added: {new Date(app.appliedDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {colApps.length === 0 && !snapshot.isDraggingOver && (
                            <div className="d-flex flex-column align-items-center justify-content-center text-muted h-100" style={{ minHeight: '100px', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                              <small>Drop a job here or click + to add</small>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </Col>
              );
            })}
          </Row>
        </DragDropContext>
      </Container>
    </motion.div>
  );
};

export default ApplicationTracker;
