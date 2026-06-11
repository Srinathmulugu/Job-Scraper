import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, NavDropdown } from 'react-bootstrap';
import { FiSun, FiMoon, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = ({ darkMode, setDarkMode }) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" className="glass-card mb-4" sticky="top">
      <Container>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary">Job Scraper</Navbar.Brand>
        </motion.div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/jobs">Find Jobs</Nav.Link>
            <Nav.Link as={Link} to="/tracker">My Tracker</Nav.Link>
            <NavDropdown title="AI Suite" id="ai-nav-dropdown">
              <NavDropdown.Item as={Link} to="/resume">Resume AI</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/interview">Interview AI</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/outreach">Outreach AI</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/predictor">Salary AI</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Portfolio & Roadmaps" id="portfolio-nav-dropdown">
              <NavDropdown.Item as={Link} to="/insights">Company Insights</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/coding-profile">Coding Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/roadmaps">Roadmaps</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/resume-builder">Resume Builder</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Button variant="link" className="text-decoration-none me-3 p-0" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun size={20} className="text-warning"/> : <FiMoon size={20} className="text-dark"/>}
            </Button>
            {user ? (
              <div className="d-flex align-items-center">
                <motion.div whileHover={{ scale: 1.05 }} className="me-3">
                  <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 d-flex align-items-center border border-warning shadow-sm" style={{ cursor: 'default' }}>
                    <FiStar className="me-2 text-danger" /> 
                    <span className="fw-bold me-2">Lvl {user.level || 5}</span> 
                    <span className="fw-normal">({user.xp || 1450} XP)</span>
                  </Badge>
                </motion.div>
                <Button variant="outline-danger" className="rounded-pill px-4" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2 fw-semibold">Login</Nav.Link>
                <Link to="/register">
                  <Button variant="primary" className="rounded-pill px-4">Register</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
