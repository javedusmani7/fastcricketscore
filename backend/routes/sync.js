const express = require('express');
const {syncSeason} = require('../controllers/sync.controller');


const router = express.Router();


router.get('/seasons', syncSeason);

module.exports = router;
