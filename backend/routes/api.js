const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches, getMatchScoreCard, getMatchSquads, getMatchLive, getPlayersProfile, getPlayerStatstic } = require('../controllers/api.controller');
const router = express.Router();


router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetionList);
router.get('/competetionMatches', getCompetetionMatches);
router.get('/matchScorecard', getMatchScoreCard);
router.get('/matchSquads', getMatchSquads);
router.get('/matchLive', getMatchLive);



router.get('/playerProfile', getPlayersProfile);
router.get('/playerStatstic', getPlayerStatstic);

module.exports = router;
