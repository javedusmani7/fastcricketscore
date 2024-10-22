const express = require('express');
const {syncSeason, syncCompetetionList , syncCompetetion, syncCompetetionMatches, syncMatchScoreCard, syncSources, syncSports} = require('../controllers/sync.controller');


const router = express.Router();


router.get('/sources', syncSources);
router.get('/sports', syncSports);
router.get('/seasons', syncSeason);
router.get('/competetions', syncCompetetionList);
// router.get('/competetionDetail', syncCompetetion);
router.get('/competetionMatch', syncCompetetionMatches);
router.get('/matchScorecard', syncMatchScoreCard);

module.exports = router;
