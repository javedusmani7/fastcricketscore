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
let lastRunTime = Date.now();

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
const syncCompletedCompetitionData = async () => {
  try {
      const url = api_url + 'sync/cronjob_for_completed_competitions?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
  } catch (error) {
      console.error('Error syncing data:', error);
  }
};

// this is automatic run function which is used to call itself automatically
// this function will make an API call to the ENTITYSPORT and get all available matches
const syncLiveCompetitionData = async () => {
  try {
      const url = api_url + 'sync/cronjob_for_live_competitions?token=' + ENTITYSPORT_API_KEY;
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

// A function to check current time and decide which cron job to run
function executeJobBasedOnTime() {
    const currentTime = Date.now();
    const elapsed = currentTime - lastRunTime;
    // console.log(`Job running at: ${new Date(currentTime).toISOString()}`);
    // console.log(`Elapsed time since last run: ${elapsed} ms`);
    lastRunTime = currentTime;

    
    const currentHour = new Date().getHours(); // Get current hour (0-23)
    if (currentHour >= 0 && currentHour < 6) {
        // console.log('Running Cron Job 1 (0:00 - 6:00)');
        // syncCompletedCompetitionData();
    } else {
        // console.log('Running Cron Job 2 (6:00 - 23:59)');
        syncLiveCompetitionData();
    }
}

// this function will make an API call and get rankings data
const syncRankings = async () => {
  try {
      const url = api_url + 'sync/rankings?token=' + ENTITYSPORT_API_KEY;
      const response = await axios.get(url);
      console.log("syncRankings Data has been successfully synced.");
  } catch (error) {
      console.error('Error syncRankings data:', error);
  }
};

console.log('Cron job scheduled: Syncing data.');

// // Schedule the task to run every 3 months once a time
syncSeasonsData();
cron.schedule('0 0 1 1,7 *', syncSeasonsData);

// // Schedule the task to run every 3 months once a time
syncCompetetionsData();
cron.schedule('0 0 1 1,4,7,10 *', syncCompetetionsData);

// // Schedule the task to run every 1 second and sync all completed matches data
// cron.schedule('* * * * * *', syncCompletedCompetitionData);
// cron.schedule('* * * * * *', syncLiveCompetitionData);
// Run the job every 1 second to check the current time
// cron.schedule('0/5 * * * * *', () => {
//     executeJobBasedOnTime();
// });
setInterval(executeJobBasedOnTime, 1000);

// // Schedule the task to run at midnight every day for syncing scheduled matches data
// cron.schedule('0 0 * * *', syncUpcomingMatchesDataForCompetetions);


// Schedule the task to run every 5 second and sync data for the live match
cron.schedule('*/30 * * * * *', syncFantasyDataForLiveMatches);
cron.schedule('*/10 * * * * *', syncLiveDataForLiveMatches);
cron.schedule('*/20 * * * * *', syncScorecardDataForLiveMatches);
cron.schedule('*/40 * * * * *', syncSquadsDataForLiveMatches);


// Once a day (midnight, 00:00:00)
syncRankings();
cron.schedule('0 0 0 * * *', () => {
    console.log('Cron job running once a day at midnight!');
    syncRankings();
});