const cron = require('node-cron');
const naukriScraper = require('../scrapers/naukriScraper');
const unstopScraper = require('../scrapers/unstopScraper');
const internshalaScraper = require('../scrapers/internshalaScraper');
const remoteokScraper = require('../scrapers/remoteokScraper');
const arbeitnowScraper = require('../scrapers/arbeitnowScraper');

const startCronJobs = () => {
  // Run every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('Running scheduled scrapers...');
    await naukriScraper.scrape();
    await unstopScraper.scrape();
    await internshalaScraper.scrape();
    await remoteokScraper.scrape();
    await arbeitnowScraper.scrape();
  });
  
  console.log('Scraper CRON jobs scheduled (runs every 12 hours).');
};

const runScrapersManually = async () => {
  console.log('Manually triggering scrapers...');
  try {
    await remoteokScraper.scrape();
    await arbeitnowScraper.scrape();
    await unstopScraper.scrape();
    await internshalaScraper.scrape();
    await naukriScraper.scrape();
    return { success: true, message: 'Scrapers completed successfully' };
  } catch(e) {
    console.error('Manual scrape error', e);
    return { success: false, message: e.message };
  }
};

module.exports = { startCronJobs, runScrapersManually };
