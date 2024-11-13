const axios = require('axios');
const mongoose = require('mongoose');
const redis = require('../config/redisClient');
// mongoose.set('debug', true);
require('dotenv').config();


// load models 
const Sport = require('../models/Sport');
const Source = require('../models/Source');
const Season = require('../models/Season');
const Competetion = require('../models/Competetion');
const Match = require('../models/Match');
const Matchscorecard = require('../models/Matchscorecard');
const Matchsquad = require('../models/Matchsquad');
const Matchlive = require('../models/Matchlive');
const Playersprofile = require('../models/Playersprofile');
const Playerstatistic = require('../models/Playerstatistic');
const MatchFantasy = require('../models/MatchFantasy');
const Competetion_Standing = require('../models/Competetion_Standing');
const Ranking = require('../models/Ranking');





// this function will make an API call on our seasons table and get all available seasons
exports.getSources = async (req, res) => {
    console.log("Inside getSeasons API call");
    
    // const key = 'cronjob_scorecard_data_for_live_matches';  // Redis key
    // const result = await redis.get(key);
    // if (result) {
    //     // Step 2: Parse the existing JSON object
    //     const existingData = JSON.parse(result);

    //     // Step 4: Store the updated JSON object back in Redis
    //     await redis.set(key, JSON.stringify(existingData));
    //     console.log('Updated data stored in Redis:', existingData);
    //     return res.status(200).json({status: 200, message: existingData });

    //   } else {
    //     console.log('No data found for key:', key);
    // }

    // const cacheKey = `api:sources`;
    // const key = 'user:1234';  // Redis key

    // // const myObject = {
    // //     user1: { name: 'John Doe', age: 30, occupation: 'Engineer' },
    // //     user2: { name: 'Jane Smith', age: 28, occupation: 'Designer' },
    // //     user3: { name: 'Mike Johnson', age: 35, occupation: 'Manager' },
    // //     user2: { name: 'javed Usmani', age: 33, occupation: 'Engineer' }
    // //   };

    
    // const myObject = {
    //     user5: { name: 'Innovation Doe', age: 40, occupation: 'testing' }
    //   };

    // // Retrieve the JSON from Redis (parse the string back into an object)
    // const result = await redis.get(key);
    // if (result) {
    //     // Step 2: Parse the existing JSON object
    //     const existingData = JSON.parse(result);

    //     // Step 3: Update the necessary key-value pairs
    //     Object.keys(myObject).forEach(userKey => {
    //         existingData[userKey] = myObject[userKey]; // Update or add user data
    //     });

    //     // Step 4: Store the updated JSON object back in Redis
    //     await redis.set(key, JSON.stringify(existingData));
    //     console.log('Updated data stored in Redis:', existingData);
    //     return res.status(200).json({status: 200, message: existingData });

    //   } else {
    //     console.log('No data found for key:', key);
    //     redis.del(key);
    //     // Store JSON in Redis (serialize the object to a string)
    //     await redis.set(key, JSON.stringify(myObject));
    // }

    // return res.status(200).json({status: 200, message: "cachedData" });

    // // Check if data is in Redis
    // const cacheKey = `key`;
    // const cachedData = await redis.get(cacheKey);
    // console.log('Value from Rediswwwwww:', cachedData);
    // if (cachedData) {
    //     console.log('Value from Rediswwwwww1:', cachedData);
    //     return res.status(200).json({status: 200, message: cachedData });
    // }
    // else{
    //     console.log('Value from Rediswwwwww2:', cachedData);
    //     return res.status(404).json({status: 404, message: 'No cache key exist' });
    // }

    // // Example: Get the value from Redis
    // // Example: Setting a value
    // redis.set('key', 'value', 'EX', 3600);
    // const jvd = redis.get('key', (err, result) => {
    //     if (err) {
    //         console.error('Error fetching from Redis:', err);
    //     } else {
    //         console.log('Value from Redis:', result);
    //     }
    // });

    
    // const response = {
    //     status: 200,
    //     message: "Seasons retrieved successfully.",
    //     data: jvd
    // }
    // res.json(response);

     // Check if data is in Redis
    //  const cachedData = await redis.get(cacheKey);
    //  if (cachedData) {
    //      return JSON.parse(cachedData);
    //  }
    //  else{
    //     return res.status(404).json({status: 404, message: 'No cache key exist' });
    //  }

    // // Making an api call from Entity sports and then saving into our database
    // try {
    //     const sportsRows = await Sport.find(); // Fetch all users

    //     // json data for returning response
    //     const response = {
    //         status: 200,
    //         message: "Seasons retrieved successfully.",
    //         data: result
    //     }
    //     res.json(response);
    // } 
    // catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    // }
}

// this function will make an API call on our seasons table and get all available seasons
exports.getSeasons = async (req, res) => {
    console.log("Inside getSeasons API call");

    // // Making an api call from Entity sports and then saving into our database
    try {
        const sportsRows = await Sport.find(); // Fetch all users

        // json data for returning response
        const response = {
            status: 200,
            message: "Seasons retrieved successfully.",
            data: sportsRows
        }
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}



exports.getCompetetionMatches = async (req, res) => {

    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // check if the match_id exists or not
    const match_id = parseInt(req.query.match_id) || false;  // Default to 10 items per page
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id not found' });
    }

    // Making an api call on our database adn send response
    try {
        // Fetch the items with pagination
        const items = await Match.find({ match_id: match_id })
        .skip(skip)
        .limit(limit)
        .exec();

        // Get the total count of items for the total pages
        const totalCount = await Match.countDocuments({ match_id: match_id });
        

        // Send the response with pagination info
        const response = {
            status: 200,
            message: "Matches retrieved successfully.",
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            data: items
        }
        res.json(response);

        
        // return res.status(200).json({status: 200, message: 'ajavasvvssvvsvs not found' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from getCompetetionMatches API' });
    }
}

// this function will make an API call to the Competetion_Standing Table and return the response
exports.getCompetetionStanding = async (req, res) => {

    // validation
    const cid = req.query.cid;
    if (!cid) {
        return res.status(404).json({status: 404, message: 'cid not found.' });
    }

    //  we are checking competetion exist on the competetions Table or not
    let competetionRow = await Competetion.findOne({cid: cid});
    if (!competetionRow) {
        return res.status(404).json({ status: 404, message: "competetion does not exist for this cid", data: [] });
    }

    // Making an api call on Competetion_Standing table and return response
    try {
        // Fetch the item
        const Competetion_Standing_Row = await Competetion_Standing.findOne({cid: cid});

        // Send the response
        return res.status(200).json({
            status: 200,
            message: "Competetion Standing retrieved successfully.",
            data: Competetion_Standing_Row
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from getCompetetionMatches API' });
    }
}

// this function will make an API call to the Scorecard Table and return the response
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.getMatchScoreCard = async (req, res) => {

    // check if the match_id exists or not
    const match_id = parseInt(req.query.match_id) || false;  // Default to 10 items per page
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id not found' });
    }

    // // Making an api call from Entity sports and then saving into our database
    try {
        // Fetch the item
        const MatchscorecardRow = await Matchscorecard.findOne({match_id: match_id});

        // Send the response
        const response = {
            status: 200,
            message: "Match Scorecard retrieved successfully.",
            data: MatchscorecardRow
        }
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
    }
}

// this function will make an API call to the Scorecard Table and return the response
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.getMatchSquads = async (req, res) => {

    // check if the match_id exists or not
    let apiResponse = [];
    const match_id = parseInt(req.query.match_id) || false;  // Default to 10 items per page
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id not found' });
    }

    // // Making an api call to our database and provide the response
    try {

        // Fetch data from matchSquad collection and check record is exis or not
        const records1 = apiResponse = await Matchsquad.find({match_id: match_id });
        if(!records1[0]){
            return res.status(404).json({status: 404, message: 'Squad for this match is not exist.', data: []});
        }


        // Fetch scorecard data from databse and getting the scorecard details based on match_id
        const records2 = await Matchscorecard.find({match_id: match_id });
        if(records1[0]){
            // Create a map for quick lookup based on the common field
            const records2Map = new Map();
            records2.forEach(record => {
                records2Map.set(record.match_id, record);
            });

            // Combine data based on the common field
            apiResponse = records1.map(record => {
                const matchingRecord = records2Map.get(record.match_id);
                return {
                    teama: record.teama,
                    teamb: record.teamb,
                    _id: record._id,
                    match_id: record.match_id,
                    teams: record.teams,
                    players: record.players,
                    format_str: matchingRecord ? matchingRecord.format_str : null,
                    status_str: matchingRecord ? matchingRecord.status_str : null,
                    status_note: matchingRecord ? matchingRecord.status_note : null,
                    live: matchingRecord ? matchingRecord.live : null,
                    match_notes: matchingRecord ? matchingRecord.match_notes : null
                };
            });
        }

        // Send the response
        return res.status(200).json({
            status: 200, 
            message: "Match Scorecard retrieved successfully.",
            data: apiResponse
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
    }
}

// this function will make an API call to the MatchLive Table and return the response
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.getMatchLive = async (req, res) => {

    // check if the match_id exists or not
    const match_id = parseInt(req.query.match_id) || false;  // Default to 10 items per page
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id not found' });
    }

    // // Making an api call from Entity sports and then saving into our database
    try {
        // Fetch the item
        const matchliveRow = await Matchlive.findOne({match_id: match_id});

        // Send the response
        const response = {
            status: 200,
            message: "MatchLive details retrieved successfully.",
            data: matchliveRow
        }
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
    }
}

// this function will make an API call to the MatchLive Table and return the response
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.getMatchFantasy = async (req, res) => {

    // check if the match_id exists or not
    const match_id = parseInt(req.query.match_id) || false;  // Default to 10 items per page
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id not found' });
    }

    // // Making an api call to get the details frm collection
    try {
        // Fetch the item
        const matchFantasyRow = await MatchFantasy.findOne({match_id: match_id});

        // Send the response
        return res.status(200).json({
            status: 200,
            message: "MatchFantasy details retrieved successfully.",
            data: matchFantasyRow
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
    }
}

exports.getCompetetionDaysNew = async (req, res) => {
    try {
        const matchesRows = await Match.aggregate([
            {
                // Stage 1: Match documents with status = 'live'
                $match: { "status_str": "Live" } // Filter for live matches
                // $match: { status: 'live' }
            },
            {
                // Stage 2: Lookup to join with competition collection
                $lookup: {
                    from: "competetions", // The name of the competition collection
                    localField: "competetion", // The field from the match collection
                    foreignField: "_id", // The field from the competition collection
                    as: "competitionDetails" // The name of the new array field to add
                }
            },
            {
                // Stage 3: Unwind competitionDetails to de-normalize the data
                $unwind: "$competitionDetails"
            },
            {
                // Stage 4: Project the fields you want
                $project: {
                    match: "$$ROOT",
                    _id: "$competitionDetails._id", // Include competition name
                    cid: "$competition.cid", // Include competition details
                    match_format: "$competition.match_format", // Include competition details
                    title: "$competition.title", // Include competition details
                }
            },
            {
                // Stage 5: Optional - Reshape the final output if you want
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$matchData", {
                            _id: "$_id",
                            cid: "$cid",
                            match_format: "$match_format",
                            title: "$title",
                            matches: "$match",
                        }]
                    }
                }
            }
        ]);
        
        // retrun response
        return res.status(200).json({status: 200, message: 'Competetions retrieved successfully.', data: matchesRows});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

exports.getCompetetionDays = async (req, res) => {
    
    console.log("Inside getCompetetionDays API call");

    try {
        
        const key = 'cronjob_scorecard_data_for_live_matches';  // Redis key
        const result = await redis.get(key);
        if (result) {
            // Step 2: Parse the existing JSON object
            const existingData = JSON.parse(result);

            // Step 4: Store the updated JSON object back in Redis
            await redis.set(key, JSON.stringify(existingData));
            
            // returning response
            return res.status(200).json({
                status: 200,
                message: "Competetions retrieved successfully.",
                data: existingData
            });

        } else {
            // returning response
            return res.status(200).json({
                status: 200,
                message: "Competetions retrieved successfully.",
                data: []
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from getCompetetionDays API' });
    }
}

// this function will make an API call on our competetionlist according to sport and season

exports.getCompetetionList = async (req, res) => {
    // // Making an api call from Entity sports and then saving into our database
    try {        
        const filter = {}
        if(req.params.category){
            filter.category = req.query.category;
        }
        

        const today = new Date();
        let oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo = oneMonthAgo.toISOString().split('T')[0];

        filter.datestart = { $gt: oneMonthAgo};

        // const competetionRows = await Competetion.find({...filter}).sort({datestart: 1}); // Fetch all competetions



        const competetionRows = await Competetion.aggregate([
            { $match: {...filter} }, // Filter orders based on criteria
            {
                $lookup: {
                    from: 'matches', // Join with Customers collection
                    localField: '_id', // The field from the Orders collection
                    foreignField: 'competetion', // The field from the Customers collection
                    as: 'matchData' // Output field to add
                }
            },
        ]);

        function formatDate(dateStr) {
            const options = { month: 'short', day: 'numeric' };
            return new Date(dateStr).toLocaleString('default', options);
        }

        function formatCountString(format, count) {
            const formatUpper = format.toUpperCase();
            return count === 1 ? `1 ${formatUpper}` : `${count} ${formatUpper}s`;
        }

        const result = {};

        const category = [];

        // Iterate over each competition in the database
        competetionRows.forEach(async (competition) => {

            // let matches = await Match.find({cid : competition._id});

            if(category.indexOf(competition.category) === -1)
                category.push(competition.category)


            const startDate = new Date(competition.datestart);
            const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });  // Get "Month Year" format

            // Initialize the month in the result object if not already present
            if (!result[monthYear]) {
                result[monthYear] = [];
            }
            

            const formatCounts = {};
            competition.rounds.forEach((round) => {
                const format = round.match_format.toLowerCase(); // Get match format (e.g., t20i, odi)
                if (formatCounts[format]) {
                    formatCounts[format]++;
                } else {
                    formatCounts[format] = 1;
                }
            });

            // Build the result string based on the counts
            const formatCountResult = Object.keys(formatCounts).map((format) => {
                return formatCountString(format, formatCounts[format]);
            }).join(", ");

            // Push the competition details into the appropriate month

            let matchesData = [];

            competition.matchData.map((match) =>{
                matchesData.push({_id : match._id, match_id : match.match_id, short_title : match.short_title, status_str : match.status_str, match_number : match.match_number, format_str : match.format_str, format_str : match.format_str, result : match.result, teama : match.teama , teamb:match.teamb , venue: match.venue , date:match.date_start_ist})
            })
            result[monthYear].push({
                id: competition._id,
                title: competition.title,
                cid: competition.cid,
                category: competition.category,
                matches:matchesData,
                formats: formatCountResult,
                dates: `${formatDate(competition.datestart)} - ${formatDate(competition.dateend)}`,
                venue: competition.venue,
                city: competition.city
            });
        });

        // json data for returning response
        const response = {
            status: 200,
            message: "Competetions retrieved successfully.",
            data: result,
            category:category
        }
        
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Our Records' });
    }
}



// this function will make an API call to the matchprofile Table and return the response
// token: for authenticate token
// pid: pid so that we can fetch the player bases of pid
exports.getPlayersProfile = async (req, res) => {

     // check if the match_id exists or not
     const pid = parseInt(req.query.pid) || false;  // Default to 10 items per page
     if (!pid) {
         return res.status(404).json({status: 404, message: 'pid not found' });
     }
 
     // // Making an api call from Entity sports and then saving into our database
     try {
         // Fetch the item
         const playersprofileRow = await Playersprofile.findOne({pid: pid});
 
         // Send the response
         const response = {
             status: 200,
             message: "Match Scorecard retrieved successfully.",
             data: playersprofileRow
         }
         res.json(response);
     } 
     catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
     }

    //  // Making an api call from Entity sports and then saving into our database
    //  try {
    //     // Check if the record already exists and if not exist sync it
    //     let dataToSave = [];
    //     let playersprofileRow = await Playersprofile.findOne({pid: pid});
    //     if (!playersprofileRow) {
    //         const url = ENTITYSPORT_API_URL + 'players/' + pid;
    //         const response = await fetchEntitySportData(token, url);
    //         const apiData = response.response;       
            
    //         // STEP 1: Additional source_id and sport_id fields, we want to include on the database
    //         const additionalFields = {
    //             sport_id: sport_primary_key,
    //             source_id: source_primary_key,
    //         };
    //         dataToSave = { ...apiData, ...additionalFields };
    //     }

    //     // Send response
    //     return res.status(200).json({
    //         status: 200,
    //         message: "Profile Sync Successfully.",
    //         data: dataToSave 
    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    // }
}



// this function will make an API call to the matchstatictic Table and return the response
// token: for authenticate token
// pid: pid so that we can fetch the player bases of pid
exports.getPlayerStatstic = async (req, res) => {

    // check if the match_id exists or not
    const pid = parseInt(req.query.pid) || false;  // Default to 10 items per page
    if (!pid) {
        return res.status(404).json({status: 404, message: 'pid not found' });
    }

    // // Making an api call from database and return data
    try {
        // Fetch the item
        const playerstatisticRow = await Playerstatistic.findOne({pid: pid});

        // Send the response
        return res.status(200).json({
            status: 200,
            message: "Player Profile Statistic retrieved Successfully",
            data: playerstatisticRow
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
    }
}

// this function will make an API call to the rankings Table and return the response
exports.getRankings = async (req, res) => {

    // // Making an api call from database and return data
    try {
        // Fetch the item
        const RankingRow = await Ranking.find(); // Fetch all Rankings

        // Send the response
        return res.status(200).json({
            status: 200,
            message: "Ranking retrieved Successfully.",
            data: RankingRow[0]
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncMatchScoreCard API' });
    }
}