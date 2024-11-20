const axios = require('axios');

// load models
const Sport = require('../models/Sport');
const Source = require('../models/Source');

const temp_apiURL = "http://localhost:3000/";
const temp_token = "ad3749cfdb0cceb518412cf46ef9e44a";
const sport_id = process.env.CRICKET_SPORT_ID;
const source_id = process.env.ENTITYSPORT_API_SOURCE_ID;
const verifyTokenMiddleware = async (req, res, next) => {

    try {

        // // temp code that will remove later
        // // using this code we are calling the matchSquads api so that data may be store in the database
        // if(req._parsedUrl.pathname == "/api/matchSquads"){
        //     const match_id = parseInt(req.query.match_id) || false;
        //     if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
        //     const response = await axios.get(temp_apiURL + 'sync/matchSquads?token=' + temp_token + "&match_id=" + match_id);
        // }

        // // temp code that will remove later
        // // using this code we are calling the matchScorecard api so that data may be store in the database
        // if(req._parsedUrl.pathname == "/api/matchScorecard"){
        //     const match_id = parseInt(req.query.match_id) || false;
        //     if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
        //     const response = await axios.get(temp_apiURL + 'sync/matchScorecard?token=' + temp_token + "&match_id=" + match_id);
        // }

        // // temp code that will remove later
        // // using this code we are calling the matchScorecard api so that data may be store in the database
        // if(req._parsedUrl.pathname == "/api/matchLive"){
        //     const match_id = parseInt(req.query.match_id) || false;
        //     if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
        //     const response = await axios.get(temp_apiURL + 'sync/matchLive?token=' + temp_token + "&match_id=" + match_id);
        // }

        // // temp code that will remove later
        // // using this code we are calling the matchFantasy api so that data may be store in the database
        // if(req._parsedUrl.pathname == "/api/matchFantasy"){
        //     const match_id = parseInt(req.query.match_id) || false;
        //     if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
        //     const response = await axios.get(temp_apiURL + 'sync/matchFantasy?token=' + temp_token + "&match_id=" + match_id);
        // }

        // // temp code that will remove later
        // // using this code we are calling the playerprofile api so that data may be store in the database
        // if(req._parsedUrl.pathname == "/api/playerProfile"){
        //     const pid = parseInt(req.query.pid) || false;
        //     if (!pid) { return res.status(404).json({status: 404, message: 'pid not found' });}
        //     const response = await axios.get(temp_apiURL + 'sync/playerProfile?token=' + temp_token + "&pid=" + pid);
        // }

        // // temp code that will remove later
        // // using this code we are calling the playerprofile api so that data may be store in the database
        // if(req._parsedUrl.pathname == "/api/playerStatstic"){
        //     const pid = parseInt(req.query.pid) || false;
        //     if (!pid) { return res.status(404).json({status: 404, message: 'pid not found' });}
        //     const response = await axios.get(temp_apiURL + 'sync/playerStatstic?token=' + temp_token + "&pid=" + pid);
        // }

        // temp code that will remove later
        // using this code we are calling the competetionStandings api so that data may be store in the database
        if(req._parsedUrl.pathname == "/api/competetionStandings"){
            const cid = parseInt(req.query.cid) || false;
            if (!cid) { return res.status(404).json({status: 404, message: 'cid not found' });}
            const response = await axios.get(temp_apiURL + 'sync/competetion_standings?token=' + temp_token + "&cid=" + cid);
        }

        // STEP 1: check if API Request has token parameter or not; 
        // if not present, return an error otherwise it goes to the routes action
        const token = req.query.token
        if (!token) {
            return res.status(401).json({  status: 401, message: 'token paramater is missing, it is required.' });
        }

        // STEP 2:  here we are getting the sport(cricket) unique id from the database
        // so that we can pass and may attached to the required table as ref key
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        req.query.sport_primary_key = sportRow._id;

        
        // STEP 3: here we are getting the source(EntitySportKey) unique id from the database
        // so that we can pass and may attached to the required table as ref key
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        req.query.source_primary_key = sourceRow._id

        next(); // Proceed to the next middleware/route handler
    }
    catch (error) {
        // code here
        console.error('API call failed:', error);
        res.status(500).send(error);
    }
};

module.exports = verifyTokenMiddleware;
