const express = require('express');
const { getSeasons, getMatches, getIntervals, updateSeasonStatus, updateInterval, synccompetitionMatchesByCid, getCompetitions, updateMatch, updateCompetition } = require('../controllers/admin.controller');
const router = express.Router();

// Seasons routes for admin dashboard
router.get('/seasons', getSeasons);
router.post('/update_season_status/:sid', updateSeasonStatus);

// competitions routes for admin dashboard
router.get('/competitions', getCompetitions);
router.put('/update_competition/:cid', updateCompetition);
router.get('/sync_competition_matches_by_cid', synccompetitionMatchesByCid);

// matches routes for admin dashboard
router.put('/update_match/:match_id', updateMatch);
router.get('/matches', getMatches);

// intervals routes for admin dashboard
router.get('/intervals', getIntervals);
router.post('/update_interval/:key', updateInterval);


module.exports = router;
