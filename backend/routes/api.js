const express = require('express');
const { getSeasons , getCompetetionList } = require('../controllers/api.controller');
const router = express.Router();


router.get('/seasons', getSeasons);
router.get('/competetions', getCompetetionList);

module.exports = router;
