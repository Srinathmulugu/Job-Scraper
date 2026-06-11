const BaseScraper = require('./baseScraper');
const axios = require('axios');

class ArbeitnowScraper extends BaseScraper {
  constructor() {
    super('Arbeitnow', 'https://www.arbeitnow.com');
  }

  async scrape() {
    console.log('Starting Arbeitnow scraper...');
    try {
      const { data } = await axios.get('https://www.arbeitnow.com/api/job-board-api');
      const jobs = data.data || [];
      
      let count = 0;
      for (let job of jobs) {
        if (count >= 15) break;
        
        const jobData = {
          title: job.title,
          company: job.company_name,
          description: job.description.replace(/<[^>]+>/g, '').substring(0, 300) + '...',
          skills: job.tags || [],
          location: job.location,
          salary: 'Not Disclosed',
          jobType: job.job_types && job.job_types.includes('contract') ? 'Contract' : (job.job_types && job.job_types.includes('part-time') ? 'Part-time' : 'Full-time'),
          workMode: job.remote ? 'Remote' : 'Onsite',
          applyLink: job.url,
          postedDate: new Date(job.created_at * 1000)
        };

        await this.saveJobToDB(jobData);
        count++;
      }
      console.log('Arbeitnow scraper finished. Scraped', count, 'jobs.');
    } catch (error) {
      console.error('Error scraping Arbeitnow:', error.message);
    }
  }
}

module.exports = new ArbeitnowScraper();
