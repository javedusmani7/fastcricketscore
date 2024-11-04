const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches, getMatchScoreCard, getMatchSquads, getMatchLive, getPlayersProfile, getPlayerStatstic, getMatchFantasy, getCompetetionDays, getSources } = require('../controllers/api.controller');
const router = express.Router();


router.get('/sources', getSources);
router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetionList);
router.get('/competetionsdays', getCompetetionDays);
router.get('/competetionMatches', getCompetetionMatches);
router.get('/matchScorecard', getMatchScoreCard);
router.get('/matchSquads', getMatchSquads);
router.get('/matchLive', getMatchLive);
router.get('/matchFantasy', getMatchFantasy);



router.get('/playerProfile', getPlayersProfile);
router.get('/playerStatstic', getPlayerStatstic);

module.exports = router;
