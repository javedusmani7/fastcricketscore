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
const updateCompetetionStatus = async () => {
    try {
        const url = api_url + 'sync/update_competetion_status?token=' + ENTITYSPORT_API_KEY;
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
// this function will make an API call to the ENTITYSPORT and get all available matches
const syncUpcomingCompetitionData = async () => {
  try {
      const url = api_url + 'sync/cronjob_for_upcoming_competitions?token=' + ENTITYSPORT_API_KEY;
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

// A function to check current time and decide which cron job to run
function executeJobBasedOnTime() {    
    // const currentHour = new Date().getHours(); // Get current hour (0-23)
    // if (currentHour >= 0 && currentHour < 6) {
    //     // console.log('Running Cron Job 1 (0:00 - 6:00)');
    //     // syncCompletedCompetitionData();
    //     syncUpcomingCompetitionData();
    // } else {
    //     // console.log('Running Cron Job 2 (6:00 - 23:59)');
    //     syncLiveCompetitionData();
    // }

    syncLiveCompetitionData();
}

const syncAninscoreData = async () => {
    try {
        const url = api_url + 'sync/aninscore?token=' + ENTITYSPORT_API_KEY;
        const response = await axios.get(url);
        console.log("Aninscore Data has been successfully synced");
    } catch (error) {
        console.error('Error syncing Aninscore data:', error);
    }
};



const updateMatchesStatus = async () => {
    try {
        const url = api_url + 'sync/update_matches_status?token=' + ENTITYSPORT_API_KEY;
        const response = await axios.get(url);
        console.log("Matches status has been successfully updated");
    } catch (error) {
        console.error('Error updated Matches status:', error);
    }
}


const getNextTwoHoursUpcomingMatches = async () => {
    try {
        const url = api_url + 'sync/next_two_hours_upcoming_matches?token=' + ENTITYSPORT_API_KEY;
        const response = await axios.get(url);
        console.log("Next Two Hours Upcoming Matches has been successfully updated");
    } catch (error) {
        console.error('Error in Next Two Hours Upcoming Matches:', error);
    }
}

console.log('Cron job scheduled: Syncing data.');

// cron job will run at midnight (00:00) on the 1st day of January and July
cron.schedule('0 0 1 1,7 *', syncSeasonsData);

// cron job will run at 1 AM (01:00) on the 1st day of January, April, July, and October
cron.schedule('0 1 1 1,4,7,10 *', syncCompetetionsData);

// Schedule task to run every hour at minute 25 - 3:25 PM, 4:25 PM, 5:25 PM, and so on.
cron.schedule('25 * * * *', () => { syncUpcomingCompetitionData(); });

// Schedule the task to run every 12 hours
cron.schedule('0 0 */12 * * *', updateCompetetionStatus);

// Schedule task to run the job every minute
cron.schedule('* * * * *', updateMatchesStatus);

// Schedule task to run the job every 2 hours
cron.schedule('0 */2 * * *', getNextTwoHoursUpcomingMatches);

// cron job will run every 5 minutes - 3:05 PM, 3:10 PM, 3:15 PM, 3:20 PM and so on
// setInterval(executeJobBasedOnTime, 50000);
cron.schedule('*/5 * * * *', () => { syncLiveCompetitionData(); });

// Schedule the task to run every 5 second and sync data for the live match
// cron.schedule('0 0 * * * *', syncFantasyDataForLiveMatches);
// cron.schedule('* * * * * *', syncLiveDataForLiveMatches);
// cron.schedule('* * * * * *', syncScorecardDataForLiveMatches);
// cron.schedule('0 0 * * * *', syncSquadsDataForLiveMatches);

cron.schedule('*/15 * * * *', syncScorecardDataForLiveMatches);


// This cron job will run every 6 hours for sync rankings
cron.schedule('0 */6 * * *', () => { syncRankings(); });


// Schedule task to run every hour at minute 15 - 3:15 PM, 4:15 PM, 5:15 PM, and so on.
// cron.schedule('15 * * * *', syncAninscoreData);