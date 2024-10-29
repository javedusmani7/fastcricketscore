const axios = require('axios');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Sport = require('./models/Sport');
const Source = require('./models/Source');

// predefine constant values
require('dotenv').config();
const ENTITYSPORT_API_KEY = process.env.ENTITYSPORT_API_KEY;
const sport_id = process.env.CRICKET_SPORT_ID;
const source_id = process.env.ENTITYSPORT_API_SOURCE_ID;
const api_url = process.env.BACKEND_API_URL;

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all available matches
const syncLiveMatchesData = async () => {

  try {
      const url = api_url + 'sync/cronjob_for_live_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all upcoming matches
const syncUpcomingMatchesData = async () => {

  try {
      const url = api_url + 'sync/cronjob_for_upcoming_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};



// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all available matches
const syncCompetetionsData = async () => {
    try {
        const url = api_url + 'sync/cronjob_for_competetion?token=' + ENTITYSPORT_API_KEY;
        const response = await axios.get(url);
    } catch (error) {
        console.error('Error syncing data:', error);
    }
};


// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all available matches
const syncCompletedMatchesData = async () => {
  try {
      const url = api_url + 'sync/cronjob_for_completed_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};



console.log('Cron job scheduled: Syncing data every 5 minutes');

// Schedule the task to run every 3 months once a time
syncCompetetionsData();
cron.schedule('0 0 1 1,4,7,10 *', syncCompetetionsData);

// Schedule the task to run every 5 minutes and sync all completed matches data
cron.schedule('*/10 * * * * *', syncCompletedMatchesData);


// Schedule the task to run every 5 minutes and sync all live matches data
cron.schedule('*/10 * * * * *', syncLiveMatchesData);

// Schedule the task to run at midnight every day for syncing scheduled matches data
cron.schedule('0 0 * * *', syncUpcomingMatchesData);