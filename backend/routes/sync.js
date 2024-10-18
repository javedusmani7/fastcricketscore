const express = require('express');
const {syncSeason, syncCompetetionList , syncCompetetion, syncCompetetionMatches} = require('../controllers/sync.controller');


const router = express.Router();


router.get('/seasons', syncSeason);
router.get('/competetions', syncCompetetionList);
router.get('/competetionDetail', syncCompetetion);
router.get('/competetionMatch', syncCompetetionMatches);

module.exports = router;
