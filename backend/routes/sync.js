const express = require('express');
const {syncSeason, syncCompetetionList , syncCompetetion, syncCompetetionMatches, syncMatchScoreCard, syncSources, syncSports, syncMatchSquads, syncMatchLive, syncPlayersProfile, syncPlayerStatstic} = require('../controllers/sync.controller');


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


// router.get('/players', syncPlayersProfile);
router.get('/playerProfile', syncPlayersProfile);
router.get('/playerStatstic', syncPlayerStatstic);

module.exports = router;
