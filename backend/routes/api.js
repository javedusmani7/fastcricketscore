const express = require('express');
const { getSeasons , getCompetetionList, getCompetetionMatches, getMatchScoreCard, getMatchSquads, getMatchLive, getPlayersProfile, getPlayerStatstic, getMatchFantasy, getCompetetionDays, getSources, getCompetetionStanding, getRankings, getCompetetionDaysNew, getArticles, getCompetetionsUpcomingMatches, getCompetetionscompletedMatches, getTeamPlayerByTeamId, getTeamDetailsByTeamId, getTeamMatchesByTeamId, getAninscore } = require('../controllers/api.controller');
const router = express.Router();


router.get('/sources', getSources);
router.get('/seasons', getSeasons);


// routes for getting competetions data
router.get('/competetions', getCompetetionList);
router.get('/competetionsdays', getCompetetionDays);
// router.get('/competetionsdaysnew', getCompetetionDaysNew);
router.get('/competetionMatches', getCompetetionMatches);
router.get('/competetionStandings', getCompetetionStanding);

router.get('/competetions_upcoming_matches', getCompetetionsUpcomingMatches);
router.get('/competetions_completed_matches', getCompetetionscompletedMatches);


// routes for getting matches data
router.get('/matchScorecard', getMatchScoreCard);
router.get('/matchSquads', getMatchSquads);
router.get('/matchLive', getMatchLive);
router.get('/matchFantasy', getMatchFantasy);



router.get('/playerProfile', getPlayersProfile);
router.get('/playerStatstic', getPlayerStatstic);
router.get('/rankings', getRankings);

// routes for the article
router.get('/articles', getArticles);

// routes for the teams actions
router.get('/teams', getTeamDetailsByTeamId);
router.get('/team_player', getTeamPlayerByTeamId);
router.get('/team_matches', getTeamMatchesByTeamId);


// routes for the AninScore actions
router.get('/aninscore', getAninscore);

module.exports = router;
