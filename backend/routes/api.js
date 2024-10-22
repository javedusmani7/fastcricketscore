const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches, getMatchScoreCard } = require('../controllers/api.controller');
const router = express.Router();


router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetionList);
router.get('/competetionMatches', getCompetetionMatches);
router.get('/matchScorecard', getMatchScoreCard);

module.exports = router;
