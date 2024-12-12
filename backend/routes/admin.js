const express = require('express');
const { getSeasons, getCompetetions, getMatches, getIntervals, postInterval } = require('../controllers/admin.controller');
const router = express.Router();


// routes for admin dashboard
router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetions);
router.get('/matches', getMatches);
router.get('/intervals', getIntervals);
router.post('/interval/:key', postInterval);



module.exports = router;
