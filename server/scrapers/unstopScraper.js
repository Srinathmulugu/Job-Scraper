const BaseScraper = require('./baseScraper');
const axios = require('axios');

class UnstopScraper extends BaseScraper {
  constructor() {
    super('Unstop', 'https://unstop.com');
  }

  async scrape() {
    console.log('Starting Unstop scraper...');
    try {
      // Hit the public JSON API used by Unstop frontend
      const { data } = await axios.get('https://unstop.com/api/public/opportunity/search-result?opportunity=jobs&page=1&per_page=15');
      
      const jobs = data?.data?.data || [];
      
      for (let job of jobs) {
        const jobData = {
          title: job.title || 'Unknown Title',
          company: job.organization || 'Unstop',
          description: job.seo_description || job.description || 'No description provided.',
          skills: job.skills ? job.skills.map(s => s.name) : [],
          location: job.jobTypes && job.jobTypes.length > 0 ? job.jobTypes[0] : 'Various',
          salary: job.salary ? job.salary.toString() : 'Not Disclosed',
          jobType: job.opportunity_type?.toLowerCase().includes('intern') ? 'Internship' : 'Full-time',
          workMode: job.opportunity_type || 'Hybrid',
          applyLink: `https://unstop.com/${job.seo_url}`,
          postedDate: job.start_date ? new Date(job.start_date) : new Date()
        };

        await this.saveJobToDB(jobData);
      }
      console.log('Unstop scraper finished. Scraped', jobs.length, 'jobs.');
    } catch (error) {
      console.error('Error scraping Unstop:', error.message);
    }
  }
}

module.exports = new UnstopScraper();
