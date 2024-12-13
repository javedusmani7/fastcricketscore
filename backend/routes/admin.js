const express = require('express');
const { getSeasons, getCompetetions, getMatches, getIntervals, updateSeasonStatus, updateInterval } = require('../controllers/admin.controller');
const router = express.Router();


// routes for admin dashboard
router.get('/seasons', getSeasons);
router.post('/update_season_status/:sid', updateSeasonStatus);

router.get('/competetions', getCompetetions);
router.get('/matches', getMatches);

router.get('/intervals', getIntervals);
router.post('/update_interval/:key', updateInterval);



module.exports = router;
