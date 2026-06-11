import React, { useState, useEffect } from 'react';
import { Modal, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiUser, FiActivity } from 'react-icons/fi';

const CommandPalette = () => {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShow(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions = [
    { name: 'Find Jobs', path: '/jobs', icon: <FiSearch className="me-3"/> },
    { name: 'Dashboard', path: '/dashboard', icon: <FiActivity className="me-3"/> },
    { name: 'My Tracker', path: '/tracker', icon: <FiBriefcase className="me-3"/> },
    { name: 'AI Resume Analyzer', path: '/resume', icon: <FiActivity className="me-3 text-primary"/> },
    { name: 'AI Interview Prep', path: '/interview', icon: <FiUser className="me-3 text-primary"/> },
    { name: 'AI Outreach Gen', path: '/outreach', icon: <FiSearch className="me-3 text-primary"/> },
    { name: 'Salary Predictor', path: '/predictor', icon: <FiActivity className="me-3"/> },
    { name: 'Company Insights', path: '/insights', icon: <FiSearch className="me-3"/> },
    { name: 'Coding Profile', path: '/coding-profile', icon: <FiBriefcase className="me-3"/> },
    { name: 'Learning Roadmaps', path: '/roadmaps', icon: <FiActivity className="me-3"/> },
    { name: 'Resume Builder', path: '/resume-builder', icon: <FiUser className="me-3"/> },
    { name: 'Profile Settings', path: '/profile', icon: <FiUser className="me-3"/> },
  ];

  const handleSelect = (path) => {
    setShow(false);
    navigate(path);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered className="command-palette">
      <Modal.Body className="p-0 border-0 rounded shadow-lg">
        <div className="d-flex align-items-center p-3 border-bottom">
          <FiSearch size={20} className="text-muted me-3 ms-2" />
          <Form.Control 
            autoFocus 
            size="lg" 
            type="text" 
            placeholder="Type a command or search..." 
            className="border-0 shadow-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ListGroup variant="flush">
          {actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase())).map((action, i) => (
            <ListGroup.Item 
              key={i} 
              action 
              className="p-3 px-4 d-flex align-items-center hover-lift"
              onClick={() => handleSelect(action.path)}
              style={{ cursor: 'pointer' }}
            >
              {action.icon}
              <span className="fw-semibold">{action.name}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default CommandPalette;
