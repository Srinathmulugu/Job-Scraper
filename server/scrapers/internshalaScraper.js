const BaseScraper = require('./baseScraper');
const axios = require('axios');
const cheerio = require('cheerio');

class InternshalaScraper extends BaseScraper {
  constructor() {
    super('Internshala', 'https://internshala.com/jobs');
  }

  async scrape() {
    console.log('Starting Internshala scraper...');
    try {
      const { data } = await axios.get('https://internshala.com/jobs/');
      const $ = cheerio.load(data);
      
      const jobs = [];
      $('.internship_meta').each((i, el) => {
        if (i >= 15) return false; // limit to 15
        
        const title = $(el).find('.job-title-href').text().trim();
        const company = $(el).find('.company-name').text().trim();
        const location = $(el).find('.locations span a').text().trim() || 'Various';
        const linkHref = $(el).find('.job-title-href').attr('href');
        const applyLink = linkHref ? 'https://internshala.com' + linkHref : null;
        
        const salary = $(el).find('.desktop').text().trim() || 'Not Disclosed';
        const description = $(el).find('.about_job .text').text().trim() || `Job opportunity at ${company} for ${title}.`;
        
        const skills = [];
        $(el).find('.job_skill').each((j, skillEl) => {
          skills.push($(skillEl).text().trim());
        });

        if (title && company && applyLink) {
          jobs.push({
            title,
            company,
            description,
            skills,
            location,
            salary,
            jobType: 'Internship',
            workMode: location.toLowerCase().includes('work from home') || location.toLowerCase().includes('remote') ? 'Remote' : 'Onsite',
            applyLink,
            postedDate: new Date()
          });
        }
      });

      for (let job of jobs) {
        await this.saveJobToDB(job);
      }
      console.log('Internshala scraper finished. Scraped', jobs.length, 'jobs.');
    } catch (error) {
      console.error('Error scraping Internshala:', error.message);
    }
  }
}

module.exports = new InternshalaScraper();
