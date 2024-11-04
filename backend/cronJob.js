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
const syncSeasonsData = async () => {
    try {
        const url = api_url + 'sync/seasons?token=' + ENTITYSPORT_API_KEY;
        const response = await axios.get(url);
    } catch (error) {
        console.error('Error syncSeasonsData Cronjob:', error);
    }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all available matches
const syncLiveMatchesDataForCompetetions = async () => {

  try {
      const url = api_url + 'sync/cronjob_for_live_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all upcoming matches
const syncUpcomingMatchesDataForCompetetions = async () => {

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
const syncCompletedMatchesDataForCompetetions = async () => {
  try {
      const url = api_url + 'sync/cronjob_for_completed_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};


// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get matches fantasy details only for live matches
const syncFantasyDataForLiveMatches = async () => {

  try {
      const url = api_url + 'sync/cronjob_fantasy_data_for_live_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
      console.log("Fantasy Data For Live Matches has been successfully synced");
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get matches live details only for live matches
const syncLiveDataForLiveMatches = async () => {

  try {
      const url = api_url + 'sync/cronjob_live_data_for_live_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
      console.log("Live Data For Live Matches has been successfully synced");
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get matches scorecard details only for live matches
const syncScorecardDataForLiveMatches = async () => {

  try {
      const url = api_url + 'sync/cronjob_scorecard_data_for_live_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
      console.log("Scorecard Data For Live Matches has been successfully synced");
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get matches playing11 squads details only for live matches
const syncSquadsDataForLiveMatches = async () => {

  try {
      const url = api_url + 'sync/cronjob_squads_data_for_live_matches?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
      console.log("Playing 11 Squads Data For Live Matches has been successfully synced");
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

console.log('Cron job scheduled: Syncing data.');

// // Schedule the task to run every 3 months once a time
syncSeasonsData();
cron.schedule('0 0 1 1,7 *', syncSeasonsData);

// // Schedule the task to run every 3 months once a time
syncCompetetionsData();
cron.schedule('0 0 1 1,4,7,10 *', syncCompetetionsData);

// // Schedule the task to run every 5 minutes and sync all completed matches data
cron.schedule('*/10 * * * * *', syncCompletedMatchesDataForCompetetions);


// // Schedule the task to run every 5 minutes and sync all live matches data
cron.schedule('*/10 * * * * *', syncLiveMatchesDataForCompetetions);

// // Schedule the task to run at midnight every day for syncing scheduled matches data
cron.schedule('0 0 * * *', syncUpcomingMatchesDataForCompetetions);


// Schedule the task to run every 5 second and sync data for the live match
cron.schedule('*/30 * * * *', syncFantasyDataForLiveMatches);
cron.schedule('*/10 * * * * *', syncLiveDataForLiveMatches);
cron.schedule('*/10 * * * * *', syncScorecardDataForLiveMatches);
cron.schedule('*/30 * * * *', syncSquadsDataForLiveMatches);