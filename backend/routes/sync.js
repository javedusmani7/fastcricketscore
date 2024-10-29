const express = require('express');
const {syncSeason, syncCompetetionList , syncCompetetion, syncCompetetionMatches, syncMatchScoreCard, syncSources, syncSports, syncMatchSquads, syncMatchLive, syncPlayersProfile, syncPlayerStatstic, syncMatchFantasy, syncCompetetionMatchesMapping, cronjobForCompetetion, cronjobForcompletedMatched, cronjobForCompletedMatched, cronjobForCompletedMatches, cronjobForLiveMatches, cronjobForUpcomingMatches} = require('../controllers/sync.controller');


const router = express.Router();


router.get('/sources', syncSources);
router.get('/sports', syncSports);
router.get('/seasons', syncSeason);

router.get('/competetions', syncCompetetionList);
// router.get('/competetionDetail', syncCompetetion);
router.get('/competetionMatch', syncCompetetionMatches);
router.get('/matchScorecard', syncMatchScoreCard);
router.get('/matchSquads', syncMatchSquads);
router.get('/matchLive', syncMatchLive);
router.get('/matchFantasy', syncMatchFantasy);


// router.get('/players', syncPlayersProfile);
router.get('/playerProfile', syncPlayersProfile);
router.get('/playerStatstic', syncPlayerStatstic);


// routes for the CronJob
router.get('/cronjob_for_competetion', cronjobForCompetetion);
router.get('/cronjob_for_completed_matches', cronjobForCompletedMatches);
router.get('/cronjob_for_live_matches', cronjobForLiveMatches);
router.get('/cronjob_for_upcoming_matches', cronjobForUpcomingMatches);
// router.get('/competetionMatchesMapping', syncCompetetionMatchesMapping);

module.exports = router;
