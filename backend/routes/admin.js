const express = require('express');
const { getSeasons, getCompetetions, getMatches } = require('../controllers/admin.controller');
const router = express.Router();


// routes for admin dashboard
router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetions);
router.get('/matches', getMatches);



module.exports = router;
