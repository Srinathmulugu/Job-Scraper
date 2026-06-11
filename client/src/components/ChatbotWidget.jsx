import React, { useState, useContext, useRef, useEffect } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ChatbotWidget = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! 👋 I am your AI career assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user?.token || ''}` } };
      // Filter out only role and content to send to API
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      const { data } = await axios.post('http://localhost:5000/api/ai/chat', { messages: apiMessages }, config);
      
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Oops! I am having trouble connecting right now.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="mb-3" style={{ transformOrigin: 'bottom right' }}>
            <Card className="shadow-lg border-0 glass-card" style={{ width: '350px', height: '450px', overflow: 'hidden' }}>
              <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                   <div className="bg-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: 30, height: 30}}>
                      <span className="text-primary fw-bold small">AI</span>
                   </div>
                   <h6 className="mb-0 fw-bold">SkillSphere Assistant</h6>
                </div>
                <FiX style={{ cursor: 'pointer' }} size={20} onClick={() => setIsOpen(false)}/>
              </div>
              
              <Card.Body className="bg-light overflow-auto d-flex flex-column" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                <div className="mt-auto">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded shadow-sm mb-3 position-relative ${msg.role === 'user' ? 'bg-primary text-white ms-4' : 'bg-white me-4'}`} style={{ borderBottomRightRadius: msg.role === 'user' ? 0 : '0.375rem', borderBottomLeftRadius: msg.role === 'assistant' ? 0 : '0.375rem' }}>
                      <small className={msg.role === 'user' ? 'text-white fw-bold' : 'text-dark fw-bold'}>{msg.role === 'user' ? 'You' : 'AI Assistant'}</small><br/>
                      <small className={msg.role === 'user' ? 'text-white' : 'text-muted'} style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</small>
                    </div>
                  ))}
                  {loading && (
                     <div className="bg-white p-3 rounded shadow-sm mb-3 me-4 d-inline-block" style={{ borderBottomLeftRadius: 0 }}>
                       <Spinner animation="dots" size="sm" variant="primary" />
                     </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </Card.Body>

              <Card.Footer className="bg-white border-top p-3">
                <Form className="d-flex align-items-center" onSubmit={handleSend}>
                  <Form.Control type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." disabled={loading} className="border-0 bg-light rounded-pill px-3 me-2 shadow-none" />
                  <Button variant="primary" type="submit" disabled={loading} className="rounded-circle p-0 d-flex align-items-center justify-content-center hover-lift" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                    <FiSend size={16} />
                  </Button>
                </Form>
              </Card.Footer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button 
          variant="primary" 
          className="rounded-circle shadow-lg d-flex align-items-center justify-content-center ms-auto"
          style={{ width: '60px', height: '60px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24}/> : <FiMessageSquare size={24}/>}
        </Button>
      </motion.div>
    </div>
  );
};
export default ChatbotWidget;
