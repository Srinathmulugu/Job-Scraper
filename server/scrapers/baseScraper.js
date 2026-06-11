const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const Job = require('../models/Job');

class BaseScraper {
  constructor(sourceName, baseUrl) {
    this.sourceName = sourceName;
    this.baseUrl = baseUrl;
  }

  async fetchHtmlAxios(url) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return cheerio.load(data);
    } catch (error) {
      console.error(`Axios Error fetching ${url}:`, error.message);
      return null;
    }
  }

  async fetchHtmlPuppeteer(url) {
    try {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2' });
      const content = await page.content();
      await browser.close();
      return cheerio.load(content);
    } catch (error) {
      console.error(`Puppeteer Error fetching ${url}:`, error.message);
      return null;
    }
  }

  async saveJobToDB(jobData) {
    try {
      const existingJob = await Job.findOne({ applyLink: jobData.applyLink });
      if (!existingJob) {
        await Job.create({ ...jobData, sourceWebsite: this.sourceName });
        console.log(`Saved new job: ${jobData.title} at ${jobData.company}`);
      }
    } catch (error) {
      console.error(`DB Error saving job:`, error.message);
    }
  }

  // To be implemented by subclasses
  async scrape() {
    throw new Error('scrape() method must be implemented');
  }
}

module.exports = BaseScraper;
