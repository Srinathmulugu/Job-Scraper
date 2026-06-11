const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');
const { runScrapersManually } = require('./cron/scraperScheduler');
const connectDB = require('./config/db');

connectDB().then(async () => {
  console.log('Database connected, clearing old jobs...');
  await Job.deleteMany({});
  console.log('Running scrapers manually...');
  try {
    await runScrapersManually();
    console.log('Scraping session finished successfully.');
  } catch (error) {
    console.error('Scraping session failed:', error.message);
  } finally {
    process.exit(0);
  }
});
