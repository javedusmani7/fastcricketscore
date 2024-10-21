const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches } = require('../controllers/api.controller');
const router = express.Router();


router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetionList);
router.get('/competetionMatches', getCompetetionMatches);

module.exports = router;
