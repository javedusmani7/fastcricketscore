const express = require('express');
const {syncSeason, syncCompetetionList , syncCompetetion} = require('../controllers/sync.controller');


const router = express.Router();


router.get('/seasons', syncSeason);
router.get('/competetions', syncCompetetionList);
router.get('/competetionDetail', syncCompetetion);

module.exports = router;
