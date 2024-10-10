const express = require('express');
const {syncSeason, syncCompetetion} = require('../controllers/sync.controller');


const router = express.Router();


router.get('/seasons', syncSeason);
router.get('/competetions', syncCompetetion);

module.exports = router;
