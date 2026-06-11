const BaseScraper = require('./baseScraper');
const axios = require('axios');

class RemoteOkScraper extends BaseScraper {
  constructor() {
    super('RemoteOk', 'https://remoteok.com');
  }

  async scrape() {
    console.log('Starting RemoteOk scraper...');
    try {
      const { data } = await axios.get('https://remoteok.com/api', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      // First element is a legal notice, so slice from 1
      const jobs = data.slice(1) || [];
      
      let count = 0;
      for (let job of jobs) {
        if (count >= 15) break;
        
        const jobData = {
          title: job.position,
          company: job.company,
          companyLogo: job.company_logo,
          description: job.description.replace(/<[^>]+>/g, '').substring(0, 300) + '...',
          skills: job.tags || [],
          location: job.location || 'Remote',
          salary: job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Not Disclosed',
          jobType: job.tags && job.tags.includes('contract') ? 'Contract' : (job.tags && job.tags.includes('part time') ? 'Part-time' : 'Full-time'),
          workMode: 'Remote',
          applyLink: job.url,
          postedDate: new Date(job.date)
        };

        await this.saveJobToDB(jobData);
        count++;
      }
      console.log('RemoteOk scraper finished. Scraped', count, 'jobs.');
    } catch (error) {
      console.error('Error scraping RemoteOk:', error.message);
    }
  }
}

module.exports = new RemoteOkScraper();
