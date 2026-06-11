const axios = require('axios');

axios.get('https://unstop.com/api/public/opportunity/search-result?opportunity=jobs&page=1&per_page=10')
  .then(res => console.log('UNSTOP SUCCESS:', res.data.data.data.length, 'jobs found'))
  .catch(err => console.error('UNSTOP ERROR:', err.message));

axios.get('https://www.naukri.com/jobapi/v3/search?noOfResults=20&urlType=search_by_keyword&searchType=adv&keyword=developer&pageNo=1', {
  headers: {
    'appid': '109',
    'systemid': '109'
  }
})
  .then(res => console.log('NAUKRI SUCCESS:', res.data.jobDetails.length, 'jobs found'))
  .catch(err => console.error('NAUKRI ERROR:', err.message));
