const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://internshala.com/jobs/')
  .then(res => {
    const $ = cheerio.load(res.data);
    const firstEl = $('.internship_meta').first();
    console.log(firstEl.html());
  })
  .catch(err => console.log('Error', err.message));
