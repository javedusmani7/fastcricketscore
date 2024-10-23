const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches, getMatchScoreCard, getMatchSquads } = require('../controllers/api.controller');
const router = express.Router();


router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetionList);
router.get('/competetionMatches', getCompetetionMatches);
router.get('/matchScorecard', getMatchScoreCard);
router.get('/matchSquads', getMatchSquads);

module.exports = router;
