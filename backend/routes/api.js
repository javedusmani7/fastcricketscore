const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches, getMatchScoreCard, getMatchSquads, getMatchLive, getPlayersProfile, getPlayerStatstic, getMatchFantasy, getCompetetionDays, getSources, getCompetetionStanding, getRankings, getCompetetionDaysNew } = require('../controllers/api.controller');
const router = express.Router();


router.get('/sources', getSources);
router.get('/seasons', getSeasons);


// routes for getting competetions data
router.get('/competetions', getCompetetionList);
router.get('/competetionsdays', getCompetetionDays);
// router.get('/competetionsdaysnew', getCompetetionDaysNew);
router.get('/competetionMatches', getCompetetionMatches);
router.get('/competetionStandings', getCompetetionStanding);


// routes for getting matches data
router.get('/matchScorecard', getMatchScoreCard);
router.get('/matchSquads', getMatchSquads);
router.get('/matchLive', getMatchLive);
router.get('/matchFantasy', getMatchFantasy);



router.get('/playerProfile', getPlayersProfile);
router.get('/playerStatstic', getPlayerStatstic);
router.get('/rankings', getRankings);

module.exports = router;
