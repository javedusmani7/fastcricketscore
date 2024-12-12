const express = require('express');
const { getSeasons, getCompetetions } = require('../controllers/admin.controller');
const router = express.Router();


// routes for admin dashboard
router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetions);



module.exports = router;
