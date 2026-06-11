import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    try {
      // Convert filters to query string
      const queryString = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`http://localhost:5000/api/jobs?${queryString}`);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, loading, fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
};
