import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge, ProgressBar, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiGithub, FiCode, FiActivity, FiDownload, FiEdit3, FiAward, FiStar, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, CategoryScale, LinearScale, BarElement, Filler } from 'chart.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { GitHubCalendar } from 'react-github-calendar';
import { ActivityCalendar } from 'react-activity-calendar';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, CategoryScale, LinearScale, BarElement, Filler);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error);
  }
  render() {
    if (this.state.hasError) {
      return <p className="text-muted text-center mt-4">GitHub Heatmap temporarily unavailable.</p>;
    }
    return this.props.children;
  }
}

const CodingProfileTracker = () => {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState({ githubUrl: '', leetcodeUrl: '', codechefUrl: '' });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/coding-profile', config);
      
      if (data.codingProfiles && (data.codingProfiles.githubUrl || data.codingProfiles.leetcodeUrl || data.codingProfiles.codechefUrl)) {
        setUrls(data.codingProfiles);
        setEditMode(false); 
        if (data.codingStats && (data.codingStats.github || data.codingStats.leetcode || data.codingStats.codechef)) {
          setStats(data.codingStats);
        }
      } else {
        setEditMode(true);
      }
    } catch (error) {
      toast.error('Failed to fetch coding profile');
      setEditMode(true);
    }
    setLoading(false);
  };

  const handleSync = async (e) => {
    e?.preventDefault();
    if (!urls.githubUrl && !urls.leetcodeUrl && !urls.codechefUrl) {
      return toast.error('Please provide at least one profile URL');
    }
    setSyncing(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/coding-profile/sync', urls, config);
      setStats(data.codingStats);
      setEditMode(false);
      toast.success('Stats synchronized successfully!');
    } catch (error) {
      toast.error('Failed to sync data. Ensure URLs are correct.');
    }
    setSyncing(false);
  };

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to unlink all coding accounts?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete('http://localhost:5000/api/coding-profile/remove', config);
      setUrls({ githubUrl: '', leetcodeUrl: '', codechefUrl: '' });
      setStats(null);
      setEditMode(true);
      toast.success('Accounts unlinked successfully');
    } catch (error) {
      toast.error('Failed to unlink accounts');
    }
  };

  const exportPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('coding_profile.pdf');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <h5 className="mt-3 text-muted">Loading your developer profile...</h5>
      </Container>
    );
  }

  // Placement Readiness Calculation
  const dsaScore = Math.min(100, Math.round(((stats?.leetcode?.totalSolved || 0) / 300) * 100));
  const githubScore = Math.min(100, Math.round(((stats?.github?.repos || 0) / 20) * 100));
  const competitiveScore = Math.min(100, Math.round(((stats?.codechef?.currentRating || 0) / 1600) * 100));
  const overallPlacementScore = Math.round((dsaScore * 0.5) + (githubScore * 0.3) + (competitiveScore * 0.2));

  const getPlacementReadinessText = (score) => {
    if (score >= 80) return { text: 'High', color: 'text-success' };
    if (score >= 50) return { text: 'Medium', color: 'text-warning' };
    return { text: 'Low', color: 'text-danger' };
  };
  const readiness = getPlacementReadinessText(overallPlacementScore);

  const getLeetcodeCalendarData = () => {
    if (!stats?.leetcode?.submissionCalendar) return { calendarArray: [], totalSubmissions: 0, activeDays: 0, maxStreak: 0 };
    const submissionCalendar = stats.leetcode.submissionCalendar;
    const entries = Object.entries(submissionCalendar);
    const dataMap = {};
    
    entries.forEach(([timestamp, count]) => {
      const dateObj = new Date(parseInt(timestamp) * 1000);
      const dateStr = dateObj.toISOString().split('T')[0];
      dataMap[dateStr] = (dataMap[dateStr] || 0) + count;
    });

    const today = new Date();
    const pastYear = new Date(today);
    pastYear.setFullYear(today.getFullYear() - 1);
    
    const calendarArray = [];
    let totalSubmissions = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    for (let d = new Date(pastYear); d <= today; d.setDate(d.getDate() + 1)) {
      const dStr = d.toISOString().split('T')[0];
      const c = dataMap[dStr] || 0;
      
      totalSubmissions += c;
      if (c > 0) {
        activeDays++;
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }

      let level = 0;
      if (c > 0) {
        if (c <= 1) level = 1;
        else if (c <= 3) level = 2;
        else if (c <= 6) level = 3;
        else level = 4;
      }
      calendarArray.push({ date: dStr, count: c, level: level });
    }
    return { calendarArray, totalSubmissions, activeDays, maxStreak };
  };

  const { calendarArray: leetcodeData, totalSubmissions, activeDays, maxStreak } = getLeetcodeCalendarData();

  return (
    <div style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold gradient-text">Coding Profile Tracker</h2>
            <p className="text-muted mb-0">Link your profile URLs to dynamically aggregate coding statistics.</p>
          </div>
          {!editMode && stats && (
            <div>
              <Button variant="outline-danger" className="me-2 rounded-pill hover-lift" onClick={handleRemove}>Unlink Accounts</Button>
              <Button variant="outline-primary" className="me-2 rounded-pill hover-lift" onClick={() => setEditMode(true)}><FiEdit3 /> Edit URLs</Button>
              <Button variant="outline-dark" className="me-2 rounded-pill hover-lift" onClick={handleSync} disabled={syncing}><FiRefreshCw className={syncing ? 'fa-spin' : ''} /> Refresh Stats</Button>
              <Button variant="primary" className="rounded-pill hover-lift shadow" onClick={exportPDF}><FiDownload /> Export PDF</Button>
            </div>
          )}
        </div>

        {editMode ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card className="glass-card shadow-lg border-0 p-5" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
              <div className="text-center mb-4">
                 <h4 className="fw-bold">Link Your Accounts</h4>
                 <p className="text-muted">You can start by linking just one account, and add more later.</p>
              </div>
              <Form onSubmit={handleSync}>
                <Row className="justify-content-center">
                  <Col md={5} className="mb-4">
                    <Form.Group>
                      <Form.Label className="fw-semibold"><FiGithub className="me-2"/>GitHub URL</Form.Label>
                      <Form.Control type="url" placeholder="https://github.com/username" value={urls.githubUrl} onChange={(e) => setUrls({...urls, githubUrl: e.target.value})} className="rounded-pill px-4 py-2" />
                    </Form.Group>
                  </Col>
                  <Col md={5} className="mb-4">
                    <Form.Group>
                      <Form.Label className="fw-semibold"><FiCode className="me-2 text-warning"/>LeetCode URL</Form.Label>
                      <Form.Control type="url" placeholder="https://leetcode.com/username" value={urls.leetcodeUrl} onChange={(e) => setUrls({...urls, leetcodeUrl: e.target.value})} className="rounded-pill px-4 py-2" />
                    </Form.Group>
                  </Col>
                </Row>

                {showMore && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Row className="justify-content-center">
                      <Col md={5} className="mb-4">
                        <Form.Group>
                          <Form.Label className="fw-semibold"><FiActivity className="me-2 text-primary"/>CodeChef URL</Form.Label>
                          <Form.Control type="url" placeholder="https://www.codechef.com/users/username" value={urls.codechefUrl} onChange={(e) => setUrls({...urls, codechefUrl: e.target.value})} className="rounded-pill px-4 py-2" />
                        </Form.Group>
                      </Col>
                    </Row>
                  </motion.div>
                )}

                <div className="text-center mt-3">
                  {!showMore && (
                    <Button variant="link" className="text-decoration-none text-muted mb-3 d-block mx-auto fw-bold" onClick={() => setShowMore(true)}>
                      + Add CodeChef Account
                    </Button>
                  )}
                  <Button variant="primary" type="submit" size="lg" disabled={syncing} className="rounded-pill px-5 fw-bold hover-lift shadow-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                    {syncing ? <><Spinner size="sm" className="me-2"/> Extracting Data...</> : 'Validate & Sync Profiles'}
                  </Button>
                </div>
              </Form>
            </Card>
          </motion.div>
        ) : (
          <div ref={printRef}>
            <Row className="mb-4">
              <Col md={4} className="mb-4">
                <Card className="glass-card shadow-lg border-0 h-100 p-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))', backdropFilter: 'blur(20px)' }}>
                  <h5 className="fw-bold mb-4">Placement Readiness Score</h5>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                     <div style={{ width: 100, height: 100 }}>
                       <CircularProgressbar 
                         value={overallPlacementScore} 
                         text={`${overallPlacementScore}%`} 
                         styles={buildStyles({ pathColor: overallPlacementScore > 75 ? '#10b981' : '#f59e0b', textColor: '#333', trailColor: '#e9ecef' })} 
                       />
                     </div>
                     <div className="text-end">
                        <h6 className="text-muted mb-1">Status</h6>
                        <h3 className={`fw-bold mb-0 ${readiness.color}`}>{readiness.text}</h3>
                     </div>
                  </div>
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-1"><small className="fw-semibold">DSA & Problem Solving</small><small>{dsaScore}%</small></div>
                    <ProgressBar variant="primary" now={dsaScore} style={{ height: '6px' }} className="mb-3 rounded-pill" />
                    
                    <div className="d-flex justify-content-between mb-1"><small className="fw-semibold">Projects & Open Source</small><small>{githubScore}%</small></div>
                    <ProgressBar variant="success" now={githubScore} style={{ height: '6px' }} className="mb-3 rounded-pill" />

                    <div className="d-flex justify-content-between mb-1"><small className="fw-semibold">Competitive Programming</small><small>{competitiveScore}%</small></div>
                    <ProgressBar variant="warning" now={competitiveScore} style={{ height: '6px' }} className="rounded-pill" />
                  </div>
                </Card>
              </Col>
              
              <Col md={8} className="mb-4">
                <Card className="glass-card shadow-lg border-0 h-100 p-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
                   <div className="d-flex justify-content-between align-items-center mb-4">
                     <h5 className="fw-bold mb-0"><FiGithub className="me-2"/> GitHub Contributions</h5>
                     <Badge bg="dark" className="rounded-pill py-2 px-3">Total Repos: {stats?.github?.repos || 0}</Badge>
                   </div>
                   {stats?.github?.username ? (
                     <div className="overflow-auto custom-scrollbar">
                       <ErrorBoundary>
                         <GitHubCalendar username={stats.github.username} colorScheme="light" fontSize={14} blockSize={12} blockMargin={4} />
                       </ErrorBoundary>
                     </div>
                   ) : (
                     <p className="text-muted text-center mt-4">Connect GitHub to view your contribution heatmap.</p>
                   )}
                </Card>
              </Col>
            </Row>

            <Row>
              {/* LeetCode Card */}
              <Col lg={4} className="mb-4">
                {stats?.leetcode ? (
                  <Card className="glass-card shadow-lg border-0 h-100 p-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
                    <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                      <div className="d-flex align-items-center">
                        <FiCode size={36} className="text-warning me-3" />
                        <div>
                          <h5 className="fw-bold mb-0">LeetCode Stats</h5>
                          <small className="text-muted">Rank: {stats.leetcode.ranking}</small>
                        </div>
                      </div>
                      <Badge bg="warning" className="text-dark rounded-pill py-2 px-3 fw-bold"><FiAward className="me-1"/> {stats.leetcode.badges} Badges</Badge>
                    </div>
                    
                    <Row className="mb-4">
                       <Col md={6} className="text-center border-end">
                          <h2 className="fw-bold text-dark mb-0">{stats.leetcode.totalSolved}</h2>
                          <small className="text-muted">Total Solved</small>
                       </Col>
                       <Col md={6} className="text-center">
                          <h2 className="fw-bold text-primary mb-0">{stats.leetcode.contestRating || 'N/A'}</h2>
                          <small className="text-muted">Contest Rating</small>
                       </Col>
                    </Row>

                    <div className="mb-3 px-3">
                      <div className="d-flex justify-content-between mb-1"><small className="fw-semibold">Easy</small><small className="text-success fw-bold">{stats.leetcode.easySolved}</small></div>
                      <ProgressBar variant="success" now={(stats.leetcode.easySolved / Math.max(stats.leetcode.totalSolved, 1)) * 100} style={{ height: '8px' }} className="rounded-pill" />
                    </div>
                    <div className="mb-3 px-3">
                      <div className="d-flex justify-content-between mb-1"><small className="fw-semibold">Medium</small><small className="text-warning fw-bold">{stats.leetcode.mediumSolved}</small></div>
                      <ProgressBar variant="warning" now={(stats.leetcode.mediumSolved / Math.max(stats.leetcode.totalSolved, 1)) * 100} style={{ height: '8px' }} className="rounded-pill" />
                    </div>
                    <div className="mb-3 px-3">
                      <div className="d-flex justify-content-between mb-1"><small className="fw-semibold">Hard</small><small className="text-danger fw-bold">{stats.leetcode.hardSolved}</small></div>
                      <ProgressBar variant="danger" now={(stats.leetcode.hardSolved / Math.max(stats.leetcode.totalSolved, 1)) * 100} style={{ height: '8px' }} className="rounded-pill" />
                    </div>

                    <div className="mt-4 border-top pt-4">
                       <h6 className="fw-bold mb-1"><FiActivity className="me-2"/> {totalSubmissions} submissions in the past one year</h6>
                       <div className="text-muted small mb-3 d-flex gap-3">
                         <span>Total active days: <strong>{activeDays}</strong></span>
                         <span>Max streak: <strong>{maxStreak}</strong></span>
                       </div>
                       
                       {leetcodeData && leetcodeData.length > 0 ? (
                         <div className="overflow-auto custom-scrollbar bg-dark p-3 rounded" style={{ borderRadius: '10px' }}>
                           <ActivityCalendar 
                             data={leetcodeData} 
                             colorScheme="dark"
                             theme={{
                               dark: ['#2d333b', '#0e4429', '#006d32', '#26a641', '#39d353'],
                             }}
                             fontSize={12}
                             blockSize={11}
                             blockMargin={4}
                             hideTotalCount
                           />
                         </div>
                       ) : (
                         <p className="text-muted small">No activity data available.</p>
                       )}
                    </div>
                  </Card>
                ) : (
                  <Card className="glass-card shadow-lg border-0 h-100 p-4 d-flex align-items-center justify-content-center"><p className="text-muted">LeetCode Unlinked</p></Card>
                )}
              </Col>

              {/* CodeChef & Leaderboard */}
              <Col lg={4} className="mb-4">
                 <Card className="glass-card shadow-lg border-0 h-100 p-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
                    <h5 className="fw-bold mb-3">Platform Leaderboard</h5>
                    <ListGroup variant="flush" className="mb-4 border rounded">
                       <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent">
                          <span className="fw-semibold">🥇 LeetCode</span>
                          <Badge bg="warning" className="text-dark rounded-pill">{stats?.leetcode?.totalSolved || 0} Solved</Badge>
                       </ListGroup.Item>
                       <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent">
                          <span className="fw-semibold">🥈 GitHub</span>
                          <Badge bg="dark" className="rounded-pill">{stats?.github?.repos || 0} Repos</Badge>
                       </ListGroup.Item>
                       <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent">
                          <span className="fw-semibold">🥉 CodeChef</span>
                          <Badge bg="primary" className="rounded-pill">{stats?.codechef?.currentRating || 0} Rating</Badge>
                       </ListGroup.Item>
                    </ListGroup>

                    {stats?.codechef && (
                      <div className="text-center mt-auto">
                        <FiActivity size={32} className="text-primary mx-auto mb-2" />
                        <h4 className="fw-bold mb-0 text-dark">{stats.codechef.currentRating} Rating</h4>
                        <p className="text-muted small">Global Rank: {stats.codechef.globalRank}</p>
                        <Badge bg="light" text="dark" className="border shadow-sm px-3 py-2 rounded-pill">
                          {stats.codechef.stars} Coder
                        </Badge>
                      </div>
                    )}
                 </Card>
              </Col>

              {/* Skill Radar */}
              <Col lg={4} className="mb-4">
                 <Card className="glass-card shadow-lg border-0 h-100 p-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
                    <h5 className="fw-bold mb-2 text-center">Skill Mastery Radar</h5>
                    <div style={{ height: '280px' }} className="d-flex justify-content-center w-100">
                      <Radar 
                        data={{
                          labels: ['Java', 'React', 'Node.js', 'MongoDB', 'DSA', 'SQL'],
                          datasets: [{
                            label: 'Proficiency (%)',
                            data: [
                              Math.min(100, dsaScore + 10), 
                              Math.min(100, githubScore + 15), 
                              Math.min(100, githubScore + 5), 
                              Math.min(100, githubScore + 2), 
                              dsaScore, 
                              Math.min(100, dsaScore + 5)
                            ],
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            borderColor: '#4f46e5',
                            pointBackgroundColor: '#ec4899',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#ec4899'
                          }]
                        }}
                        options={{ 
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              angleLines: { color: 'rgba(0,0,0,0.1)' },
                              grid: { color: 'rgba(0,0,0,0.1)' },
                              pointLabels: { font: { size: 11, weight: 'bold' } },
                              ticks: { display: false, min: 0, max: 100 }
                            }
                          }
                        }}
                      />
                    </div>
                 </Card>
              </Col>

            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CodingProfileTracker;
