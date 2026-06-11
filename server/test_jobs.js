const axios = require('axios');
axios.get('http://localhost:5000/api/jobs')
  .then(res => console.log('TOTAL JOBS:', res.data.totalJobs, 'First job:', res.data.jobs[0]))
  .catch(err => console.error('ERROR:', err.message));
