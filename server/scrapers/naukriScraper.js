const BaseScraper = require('./baseScraper');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class NaukriScraper extends BaseScraper {
  constructor() {
    super('Naukri', 'https://www.naukri.com/');
  }

  async scrape() {
    console.log('Starting Naukri scraper with Puppeteer...');
    let browser;
    try {
      browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
      const page = await browser.newPage();
      
      // Navigate to IT jobs page
      await page.goto('https://www.naukri.com/it-jobs', { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Scroll to load jobs
      await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 2000));

      const content = await page.content();
      const $ = cheerio.load(content);
      
      const jobs = [];
      $('.srp-jobtuple-wrapper').each((i, el) => {
        if (i >= 15) return false;

        const title = $(el).find('.title').text().trim();
        const company = $(el).find('.comp-name').text().trim();
        const location = $(el).find('.locWdth').text().trim();
        const applyLink = $(el).find('.title').attr('href');
        const salary = $(el).find('.sal').text().trim() || 'Not Disclosed';
        const description = $(el).find('.job-desc').text().trim();
        
        let skills = [];
        $(el).find('.dot-tag').each((j, tag) => {
          skills.push($(tag).text().trim());
        });

        if (title && company && applyLink) {
          jobs.push({
            title,
            company,
            description,
            skills,
            location,
            salary,
            jobType: 'Full-time',
            workMode: location.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
            applyLink,
            postedDate: new Date()
          });
        }
      });

      for (let job of jobs) {
        await this.saveJobToDB(job);
      }
      
      console.log('Naukri scraper finished. Scraped', jobs.length, 'jobs.');
    } catch (error) {
      console.error('Error scraping Naukri:', error.message);
    } finally {
      if (browser) await browser.close();
    }
  }
}

module.exports = new NaukriScraper();
