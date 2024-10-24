const axios = require('axios');

const temp_apiURL = "http://localhost:3000/";
const temp_token = "ad3749cfdb0cceb518412cf46ef9e44a";
const verifyTokenMiddleware = async (req, res, next) => {

    try {

        // temp code that will remove later
        // using this code we are calling the matchSquads api so that data may be store in the database
        if(req._parsedUrl.pathname == "/api/matchSquads"){
            const match_id = parseInt(req.query.match_id) || false;
            if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
            const response = await axios.get(temp_apiURL + 'sync/matchSquads?token=' + temp_token + "&match_id=" + match_id);
        }

        // temp code that will remove later
        // using this code we are calling the matchScorecard api so that data may be store in the database
        if(req._parsedUrl.pathname == "/api/matchScorecard"){
            const match_id = parseInt(req.query.match_id) || false;
            if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
            const response = await axios.get(temp_apiURL + 'sync/matchScorecard?token=' + temp_token + "&match_id=" + match_id);
        }

        // temp code that will remove later
        // using this code we are calling the matchScorecard api so that data may be store in the database
        if(req._parsedUrl.pathname == "/api/matchLive"){
            const match_id = parseInt(req.query.match_id) || false;
            if (!match_id) { return res.status(404).json({status: 404, message: 'match_id not found' });}
            const response = await axios.get(temp_apiURL + 'sync/matchLive?token=' + temp_token + "&match_id=" + match_id);
        }

        // temp code that will remove later
        // using this code we are calling the playerprofile api so that data may be store in the database
        if(req._parsedUrl.pathname == "/api/playerProfile"){
            const pid = parseInt(req.query.pid) || false;
            if (!pid) { return res.status(404).json({status: 404, message: 'pidd not found' });}
            const response = await axios.get(temp_apiURL + 'sync/playerProfile?token=' + temp_token + "&pid=" + pid);
        }
        


        // check if API Request has token parameter or not; 
        // if not present, return an error otherwise it goes to the routes action
        const token = req.query.token
        if (!token) {
            return res.status(401).json({  status: 401, message: 'token paramater is missing, it is required.' });
        }

        next(); // Proceed to the next middleware/route handler
    }
    catch (error) {
        // code here
        console.error('API call failed:', error);
        res.status(500).send(error);
    }
};

module.exports = verifyTokenMiddleware;
