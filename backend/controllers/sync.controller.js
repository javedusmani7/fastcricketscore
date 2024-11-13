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
const { fetchEntitySportData, fetchEntitySportPlayersProfile } = require('../utils/EntitySports.util');
const Matchlive = require('../models/Matchlive');
const Playersprofile = require('../models/Playersprofile');
const Playerstatistic = require('../models/Playerstatistic');
const MatchFantasy = require('../models/MatchFantasy');
const Competetion_Matches_Mapping = require('../models/Competetion_Matches_Mapping');
const Competetion_Standing = require('../models/Competetion_Standing');
const RankingModel = require('../models/Ranking');

// predefine constant values
const ENTITYSPORT_API_KEY = process.env.ENTITYSPORT_API_KEY;
const ENTITYSPORT_API_URL = process.env.ENTITYSPORT_API_URL;
const sport_id = process.env.CRICKET_SPORT_ID;
const source_id = process.env.ENTITYSPORT_API_SOURCE_ID;
const api_url = process.env.BACKEND_API_URL;


// Dammy API for inserting records in Sports table
exports.syncSports = async (req, res) => {

    const result = await Sport.insertMany([  
        { 
            sport_id: 4,
            name:"Cricket", 
            description:"This sport is use to handle all available options in the Cricket.", 
            status: 1, 
            create_date:new Date(Date.now()), 
            update_date:new Date(Date.now())
        },
        { 
            sport_id: 1,
            name:"Soccer", 
            description:"This sport is use to handle all available options in the Soccer.", 
            status: 1, 
            create_date:new Date(Date.now()), 
            update_date:new Date(Date.now())
        },
        { 
            sport_id: 2,
            name:"Tennis", 
            description:"This sport is use to handle all available options in the Tennis.", 
            status: 1, 
            create_date:new Date(Date.now()), 
            update_date:new Date(Date.now())
        },
        { 
            sport_id: 3,
            name:"Football", 
            description:"This sport is use to handle all available options in the Football.", 
            status: 1, 
            create_date:new Date(Date.now()), 
            update_date:new Date(Date.now())
        }
    ]);

    // Send the response with pagination info
    const response = {
        status: 200,
        message: "Sports inserted successfully.",
        data: result
    }
    res.json(response);
}

// Dammy API for inserting records in sources table
exports.syncSources = async (req, res) => {

     // Sample data to insert or update
     const records = [  
        { 
            source_id: 1,
            name:"Entitydasdadadsport", 
            description:"This Api will be use to get all available data from this source and display the results accordingly.", 
            status: 1, 
            create_date:new Date(Date.now()), 
            update_date:new Date(Date.now())
        },
        { 
            source_id: 2,
            name:"Live dsadsaad", 
            description:"This Api will be use to get all available data from this source and display the results accordingly.", 
            status: 1, 
            create_date:new Date(Date.now()), 
            update_date:new Date(Date.now())
        }
    ];

    // Prepare bulk write operations
    const operations = records.map(record => ({
        updateOne: {
            filter: { source_id: record.source_id }, // Specify the filter condition
            update: { $set: record }, // Specify the fields to update
            upsert: true // Create the document if it does not exist
        }
    }));

    // const result = await Source.insertMany();
    const result = await Source.bulkWrite(operations);

    // Send the response with pagination info
    const response = {
        status: 200,
        message: "Sources inserted successfully.",
        data: result
    }
    res.json(response);

}

// this function will make an API call to the ENTITYSPORT and get all available seasons
// once we get it, it will store to the database
exports.syncSeason = async (req, res) => {
    let sport_primary_key = false;
    let source_primary_key = false;
    
    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the match tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }



    // Making an api call from Entity sports and then saving into our database
    try {
        const token = req.query.token;
        const response = await fetchEntitySportData(token , ENTITYSPORT_API_URL + 'seasons');

        // updating new items on the response so that we may have sport on each items
        const items = response.response.items;
        const updatedItems = items.map(item => {
            return {
                ...item,         // Spread existing properties
                sport_id: sport_primary_key,  // Add a new property
                source_id: source_primary_key //"6711f69024bc088184fe6911"  // Add a new property
            };
        });

         // Prepare bulk operations
        // const items = response.response.items;
        const bulkOps = updatedItems.map(item => ({
            updateOne: {
                filter: { sid: item.sid }, 
                update: { $set: item }, 
                upsert: true // Insert if not found
            }
        }));

        // Execute bulk operations
        const result = await Season.bulkWrite(bulkOps);

        // Insert each user into the MongoDB collection
        // await Season.insertMany(response.response.items);
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

// this function will make an API call to the ENTITYSPORT and get all available matches based on competetionId
// token: for authenticate token
// cid: competetionId so that we can fetch the matches bases of cid
exports.syncCompetetionMatchesMapping = async (req, res) => {
    console.log("step1");
    
    // get parameters and check for the required validation
    let sport_primary_key = false;
    let source_primary_key = false;
    let competetion_primary_key = false;

    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the match tables
    try {

        console.log("step2");
        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }

    // Second; we are synching the competetions and their matches one by one
    try {
        console.log("step3");
        let Competetion_Matches_Mapping_Row = await Competetion_Matches_Mapping.findOne();
        if (Competetion_Matches_Mapping_Row) {
            console.log("step4");
            
            // Step 1: we will get the competetion those status=result(Means it has completed and only sync single time)
            let Competetion_Matches_Mapping_Completed_Row = await Competetion_Matches_Mapping.findOne({active: 1, status: "result"});
            if (Competetion_Matches_Mapping_Completed_Row) {
                const cid = Competetion_Matches_Mapping_Completed_Row.cid;
                // once match os sync now we are updating mapping table so that it would not sync again
                const url = api_url + 'sync/competetionMatch?token=' + ENTITYSPORT_API_KEY + "&cid=" + cid;
                const response = await axios.get(url);
                if(response?.data?.length > 0){
                    console.log("step4-resp-if", cid);
                    const result = await Competetion_Matches_Mapping.updateOne({ cid: cid }, { $set: {active: 0 } });
                }
            }


            console.log("step5");
            
            // Step 2: we will get the competetion those status!=result(Means it has not completed yet and need multiple sync)
            const competetionRecordsRows = await Competetion_Matches_Mapping.find({ active: 1, status: { $ne: "result" } });
            const finalResponse = await Promise.all(competetionRecordsRows.map(async (row) => {
                const url = api_url + 'sync/competetionMatch?token=' + ENTITYSPORT_API_KEY + "&cid=" + row.cid;
                const response = await axios.get(url);
            }));
        }
        else{
            console.log("step6");
        }
        
        console.log("step12");
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

// this function will make an API call to the ENTITYSPORT and get all available matches based on competetionId
// token: for authenticate token
// cid: competetionId so that we can fetch the matches bases of cid
exports.syncCompetetionMatches = async (req, res) => {
    
    // get parameters and check for the required validation
    const token = req.query.token;
    const cid = req.query.cid;
    let sport_primary_key = false;
    let source_primary_key = false;
    let competetion_primary_key = false;
    if (!cid) { res.json({ status: 401, message: 'cid paramater is missing, it are required.' });}

    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the match tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;

        // check if the source exists or not
        const competetionRow = await Competetion.findOne({cid: cid});
        if (!competetionRow) {
            return res.status(404).json({status: 404, message: 'Competetion not found' });
        }
        competetion_primary_key = competetionRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }


    // Making an api call from Entity sports and then saving into our database
    try {
        const url = ENTITYSPORT_API_URL + 'competitions/' + cid + '/matches/';
        const response = await fetchEntitySportData(token, url);

        // updating new items on the response so that we may have sport & sourceId on each items
        const items = response.response.items;
        const updatedItems = items.map(item => {
            return {
                ...item,         // Spread existing properties
                cid: competetion_primary_key,  // Add a new property
                sport_id: sport_primary_key,  // Add a new property
                source_id: source_primary_key //"6711f69024bc088184fe6911"  // Add a new property
            };
        });
        

         // Prepare bulk operations

        const bulkOps = updatedItems.map(item => ({
            updateOne: {
                filter: { match_id: item.match_id }, 
                update: { $set: item }, 
                upsert: true // Insert if not found
            }
        }));

        // Execute bulk operations
        const result = await Match.bulkWrite(bulkOps);

        // Send response
        res.json(updatedItems);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


// this function will make an API call to the ENTITYSPORT and get matches scorecard based on competetionId
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.syncMatchScoreCard = async (req, res) => {

    // get parameters and check for the required validation
    let sport_primary_key = false;
    let source_primary_key = false;
    const token = req.query.token;
    const match_id = req.query.match_id;
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id paramater is missing, it are required.' });
    }
    
    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the matchscorecard tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }
    
    // Making an api call from Entity sports and then saving into our database
    try {
        const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/scorecard/';
        const response = await fetchEntitySportData(token, url);
        const apiData = response.response;

        // STEP 1: Additional source_id and sport_id fields, we want to include on the database
        const additionalFields = {
            sport_id: sport_primary_key,
            source_id: source_primary_key
        };
        const dataToSave = { ...apiData, ...additionalFields };

        // Step 2: Check if the record already exists
        // insert and update the records accordingly
        let MatchscorecardRow = await Matchscorecard.findOne({match_id: match_id});
        if (MatchscorecardRow) {
            // Step 3A: Update the existing record
            Object.assign(MatchscorecardRow, dataToSave); // Merge the new data into the existing user object
            await MatchscorecardRow.save();
        }
        else{
            // Step 3B: Create a new record
            MatchscorecardRow = new Matchscorecard(dataToSave);
            await MatchscorecardRow.save();
        }

        // Send response
        return res.status(200).json({
            status: 200,
            data: dataToSave 
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


// this function will make an API call to the ENTITYSPORT and get matches playing11 squads based on match_id
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.syncMatchSquads = async (req, res) => {

    // get parameters and check for the required validation
    let sport_primary_key = false;
    let source_primary_key = false;
    const token = req.query.token;
    const match_id = req.query.match_id;
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id paramater is missing, it are required.' });
    }
    
    // STEP first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the matchsSquad tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }

    
    
    // STEP Second; Making an api call from Entity sports and then saving into our database
    try {
        const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/squads/';
        const response = await fetchEntitySportData(token, url);
        const apiData = response.response;

        // STEP 1: Additional source_id and sport_id fields, we want to include on the database
        const additionalFields = {
            sport_id: sport_primary_key,
            source_id: source_primary_key,
            match_id: match_id
        };
        const dataToSave = { ...apiData, ...additionalFields };

        // Step 2: Check if the record already exists
        // insert and update the records accordingly
        let MatchsquadRow = await Matchsquad.findOne({match_id: match_id});
        if (MatchsquadRow) {
            // Step 3A: Update the existing record
            Object.assign(MatchsquadRow, dataToSave); // Merge the new data into the existing user object
            await MatchsquadRow.save();
        }
        else{
            // Step 3B: Create a new record
            MatchsquadRow = new Matchsquad(dataToSave);
            await MatchsquadRow.save();
        }

        // Send response
        return res.status(200).json({
            status: 200,
            data: dataToSave 
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


// this function will make an API call to the ENTITYSPORT and get Live matches details based on match_id
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.syncMatchLive = async (req, res) => {

    // get parameters and check for the required validation
    let sport_primary_key = false;
    let source_primary_key = false;
    const token = req.query.token;
    const match_id = req.query.match_id;
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id paramater is missing, it are required.' });
    }
    
    // STEP first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the matchsSquad tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }

    
    
    // STEP Second; Making an api call from Entity sports and then saving into our database
    try {
        const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/live/';
        const response = await fetchEntitySportData(token, url);
        const apiData = response.response;
        if(apiData == "Data unavailable"){
            return res.status(404).json({status: 404, message: apiData });
        }

        // STEP 1: Additional source_id and sport_id fields, we want to include on the database
        const additionalFields = {
            sport_id: sport_primary_key,
            source_id: source_primary_key,
            match_id: match_id
        };
        const dataToSave = { ...apiData, ...additionalFields };

        // Step 2: Check if the record already exists
        // insert and update the records accordingly
        let matchliveRow = await Matchlive.findOne({match_id: match_id});
        if (matchliveRow) {
            // Step 3A: Update the existing record
            Object.assign(matchliveRow, dataToSave); // Merge the new data into the existing user object
            await matchliveRow.save();
        }
        else{
            // Step 3B: Create a new record
            matchliveRow = new Matchlive(dataToSave);
            await matchliveRow.save();
        }

        // Send response
        return res.status(200).json({
            status: 200,
            data: dataToSave 
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


exports.syncCompetetionList = async (req, res) => {

    let sport_primary_key = false;
    let source_primary_key = false;
    
    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the match tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }


    try {
        const token = req.query.token;

        const seasons = await Season.find({status:true});

        const finalResponse = await Promise.all(seasons.map(async (season) => {
            return await fetchEntitySportData(token , ENTITYSPORT_API_URL + "seasons/" + season.name + "/" +'competitions' , 100000);
        }));

        let resultSize = finalResponse?.length;
        
        if(resultSize > 0){

            finalResponse.map(async (response , i) => {
    
                if(response.status == "unauthorized" || response.status == "forbidden"){
                    res.status(200).json({ status : false , message: 'Error fetching data from Entitysport API' });
    
                }else{
        
                    const items = response.response.items;
        
                    const updatedItems = items.map(item => {
                        return {
                            ...item,         // Spread existing properties
                            sport_id: sport_primary_key,  // Add a new property
                            source_id: source_primary_key // Add a new property
                        };
                    });
        
        
                    const bulkOps = updatedItems.map(item => ({
                        updateOne: {
                            filter: { cid: item.cid }, 
                            update: { $set: item }, 
                            upsert: true // Insert if not found
                        }
                    }));
                    
        
                    const result = await Competetion.bulkWrite(bulkOps);
        
                    if(!result){
                        res.status(200).json({ status : false , message: "Problem in Insert" });
                    }
                    
                }

                if(i == resultSize - 1){

                    res.status(200).json({ status : true , message: "Season Competetions Synced" });

                }
    
            })


        }else{
            res.status(200).json({ status : false , message: 'Error fetching data from Entitysport API' });
        }
        

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Competition standings API provides standing table for all of the round or groups for the specified competition.
exports.syncCompetetionStandings = async (req, res) => {
    const cid = req.query.cid;
    if (!cid) {
        return res.status(404).json({status: 404, message: 'cid not found.' });
    }

    //  we are checking competetion exist on the competetions Table or not
    let competetionRow = await Competetion.findOne({cid: cid});
    if (!competetionRow) {
        return res.status(404).json({ status: 404, message: "competetion does not exist for this cid", data: [] });
    }
    
    try {
        // calling supportive api for accessing tournament standings
        saveCompetetionStandingsDataForLiveMatch(req, res, cid);
        // retrun response
        return res.status(200).json({status: 200, message: 'Sync Successfully.'});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


exports.syncCompetetion = async (req, res) => {
    // try {
    //     const token = req.query.token;
    //     const competetionId = req.query.cid;

    //     console.log();
    //     const response = await fetchCompetetionDataFromEntitySport(token , ENTITYSPORT_API_URL + 'competitions/' + competetionId);
        
    //     if(response.status == "unauthorized" || response.status == "forbidden"){
    //         res.status(200).json({ status : false , message: 'Error fetching data from Entitysport API' });
    //     }else{
    //         res.status(200).json({ status : true , message: response.response });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    // }
}


// this function will make an API call to the ENTITYSPORT and get matche Fantasy details
// token: for authenticate token
// match_id: match_id so that we can fetch the scorecard bases of match_id
exports.syncMatchFantasy = async (req, res) => {

    // get parameters and check for the required validation
    let dataToSave = [];
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    const token = req.query.token;
    const match_id = req.query.match_id;
    if (!match_id) {
        return res.status(404).json({status: 404, message: 'match_id paramater is missing, it are required.' });
    }    
    
    // Making an api call from Entity sports and then saving into our database
    try {
        // first we are checking match exist on the Match Table or not
        let matchRow = await Match.findOne({match_id: match_id});
        if (!matchRow) {
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Match does not exist for this match_id",
                data: [] 
            });
        }

        let matchFantasyRow = await MatchFantasy.findOne({match_id: match_id});
        if (matchFantasyRow) {
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Match Fantasy Sync Successfully.",
                data: matchFantasyRow 
            });
        }
        else{
            const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/newpoint2/';
            const response = await fetchEntitySportData(token, url);
            const apiData = response.response;
            if(apiData !== undefined && response.status === "ok" ) {
                
                // STEP 1: Additional source_id and sport_id fields, we want to include on the database
                const additionalFields = {
                    sport_id: sport_primary_key,
                    source_id: source_primary_key,
                    match: matchRow._id,
                    match_id: match_id,
                };
                dataToSave = { ...apiData, ...additionalFields };
                
                // Step 2: Create a new record
                matchFantasyRow = new MatchFantasy(dataToSave);
                await matchFantasyRow.save();
            }
            
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Player Profile Statistic Sync Successfully.",
                data: dataToSave 
            });            
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


// this function will make an API call to the ENTITYSPORT and get Players Profile data
// token: for authenticate token
exports.syncPlayersProfile_BAK_FOR_BULK = async (req, res) => {
    
    // first; we will get the primaryID details for the sport, source table 
    // so that we can pass these references to the playerProfile tables
    let sport_primary_key = false;
    let source_primary_key = false;
    const token = req.query.token;
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }

    
    // Making an api call from Entity sports and then saving into our database
    try {
        const url = ENTITYSPORT_API_URL + 'players/';
        const response = await fetchEntitySportPlayersProfile(token, url, 1000);
        console.log(response.length);

        // updating new items on the response so that we may have sport & sourceId on each items
        const updatedItems = response.map(item => {
            return {
                ...item,         // Spread existing properties
                sport_id: sport_primary_key,  // Add a new property
                source_id: source_primary_key //"6711f69024bc088184fe6911"  // Add a new property
            };
        });
        

         // Prepare bulk operations
        console.log(updatedItems.length);
        const bulkOps = updatedItems.map(item => ({
            updateOne: {
                filter: { pid: item.pid }, 
                update: { $set: item }, 
                upsert: true // Insert if not found
            }
        }));

        // // Execute bulk operations
        console.log(bulkOps.length);
        const result = await Playersprofile.bulkWrite(bulkOps);

        // Send response
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


// this function will make an API call to the ENTITYSPORT and get Players Profile data
// token: for authenticate token
exports.syncPlayersProfile = async (req, res) => {    
    let sport_primary_key = false;
    let source_primary_key = false;
    let dataToSave = [];
    const token = req.query.token;
    const pid = req.query.pid;
    if (!pid) {
        return res.status(404).json({status: 404, message: 'pid paramater is missing, it are required.' });
    }
    
    // first; we will get the primaryID details for the sport, source table 
    // so that we can pass these references to the playerProfile tables
    try {
        let playersprofileRow = await Playersprofile.findOne({pid: pid});
        if (playersprofileRow) {
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Profile Sync Successfully.",
                data: playersprofileRow 
            });
        }
        else{
            // check if the sports exists or not
            const sportRow = await Sport.findOne({sport_id: sport_id});
            if (!sportRow) {
                return res.status(404).json({status: 404, message: 'Sport not found' });
            }
            sport_primary_key = sportRow._id;
    
            // check if the source exists or not
            const sourceRow = await Source.findOne({source_id: source_id});
            if (!sourceRow) {
                return res.status(404).json({status: 404, message: 'Source not found' });
            }
            source_primary_key = sourceRow._id;  
            
            
            // Making an api call from Entity sports and then saving into our database
            const url = ENTITYSPORT_API_URL + 'players/' + pid;
            const response = await fetchEntitySportData(token, url);
            const apiData = response.response.player;  
            if(apiData !== undefined) {
                // STEP 1: Additional source_id and sport_id fields, we want to include on the database
                const additionalFields = {
                    sport_id: sport_primary_key,
                    source_id: source_primary_key,
                };
                dataToSave = { ...apiData, ...additionalFields };
                
                // Step 3B: Create a new record
                playersprofileRow = new Playersprofile(dataToSave);
                await playersprofileRow.save();
            }
            
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Profile Sync Successfully.",
                data: dataToSave 
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncPlayersProfile. ', error });
    }
}


// this function will make an API call to the ENTITYSPORT and get Players statistic data
// token: for authenticate token
exports.syncPlayerStatstic = async (req, res) => {
    let dataToSave = [];
    const pid = req.query.pid;
    const token = req.query.token;
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!pid) {
        return res.status(404).json({status: 404, message: 'pid paramater is missing, it are required.' });
    }
    
    // we are checking, records exist for this pid or not, if exist return the data
    try {
        let playerStatisticRow = await Playerstatistic.findOne({pid: pid});
        if (playerStatisticRow) {
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Player Profile Statistic Sync Successfully.",
                data: playerStatisticRow 
            });
        }
        else{
            // Making an api call from Entity sports and then saving into our database
            const url = ENTITYSPORT_API_URL + 'players/' + pid + '/stats';
            const response = await fetchEntitySportData(token, url);
            const apiData = response.response;
            if(apiData !== undefined && response.status === "ok" ) {
                
                // STEP 1: Additional source_id and sport_id fields, we want to include on the database
                const additionalFields = {
                    sport_id: sport_primary_key,
                    source_id: source_primary_key,
                    pid: pid,
                };
                dataToSave = { ...apiData, ...additionalFields };
                
                // Step 2: Create a new record
                playerStatisticRow = new Playerstatistic(dataToSave);
                await playerStatisticRow.save();
            }
            
            // Send response
            return res.status(200).json({
                status: 200,
                message: "Player Profile Statistic Sync Successfully.",
                data: dataToSave 
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncPlayersProfile. ', error });
    }
}

// this function will make an API call to the ENTITYSPORT and get Rankings data
exports.syncRankings = async (req, res) => {
    const token = req.query.token;
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    
    try {
        
        // Making an api call from Entity sports and then saving into our database
        const url = ENTITYSPORT_API_URL + 'iccranks/';
        const response = await fetchEntitySportData(token, url);
        const apiData = response.response;
        if(apiData !== undefined && response.status === "ok" ) {
            
            // STEP 1: Additional source_id and sport_id fields, we want to include on the database
            const additionalFields = {
                sport_id: sport_primary_key,
                source_id: source_primary_key
            };
            const dataToSave = { ...apiData, ...additionalFields };
        
            // Step 2: Check if the record already exists and insert or update the record accordingly
            const result = await RankingModel.updateOne({sport_id: sport_primary_key}, { $set: dataToSave}, { upsert: true });
        }
        
        // Send response
        return res.status(200).json({
            status: 200,
            message: "Player Ranking Sync Successfully."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from syncPlayersProfile. ', error });
    }
}

// START: CronJob Methods START from Here

// this function will make an API call to the ENTITYSPORT and get all available matched based on competetionId and those status="result(completed)"
exports.cronjobForCompletedCompetitions = async (req, res) => {

    try {            
        // Step 1: we will get the competetion those status=result(Means, competeion has been completed)
        let Competetion_Matches_Mapping_Completed_Row = await Competetion_Matches_Mapping.findOne({active: true, status: "result"});
        if (Competetion_Matches_Mapping_Completed_Row) {

            // check if the Competetion exists or not
            const cid = Competetion_Matches_Mapping_Completed_Row.cid;
            if(cid){
                await saveCompetitionMatches(req, res, cid);
                // update the Competetion_Matches_Mapping table because this competation match has been sync
                const result = await Competetion_Matches_Mapping.updateOne({ cid: cid }, { $set: {active: false } });
            }
        }
        
        // return response
        console.log("cronjobForCompletedCompetitions API run Successfully");
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Error on cronjobForCompletedCompetitions API', data: error.message });
    }
}


// this function will make an API call to the ENTITYSPORT and get all available matched based on competetionId and those status="live"
exports.cronjobForLiveCompetitions = async (req, res) => {
    try {
        // Step 1: we will get the competetion those status=result(Means, competeion has been completed)
        let Competetion_Matches_Mapping_Completed_Row = await Competetion_Matches_Mapping.findOne({active: true, status: "live"});
        if (Competetion_Matches_Mapping_Completed_Row) {

            // check if the Competetion exists or not
            const cid = Competetion_Matches_Mapping_Completed_Row.cid;
            if(cid){
                await saveCompetitionMatches(req, res, cid);
                // update the Competetion_Matches_Mapping table because this competation match has been sync
                const result = await Competetion_Matches_Mapping.updateOne({ cid: cid }, { $set: {active: false } });
            }
        }
        else{
            // Define the update operation and Perform the update
            const updateDoc = { $set: { active: true, updatedAt: new Date() }};
            const result = await Competetion_Matches_Mapping.updateMany({ status: 'live' }, updateDoc);
        }

        // // We will get the competetion those status=Live(Means it has running now)
        // const competetionRecordsRows = await Competetion_Matches_Mapping.find({status: "live" });

        // // second, Iterate through each record and will sync their fantasy point
        // for (const row of competetionRecordsRows) {
        //     try {
        //         if(row.cid){
        //             console.log(":cronjobForLiveCompetitions1:::",  row.cid);
        //             await saveCompetitionMatches(req, res, row.cid);
        //         }
        //     } catch (apiError) {
        //         console.error('cronjobForLiveCompetitions::: Error inside for each:', apiError.message);
        //     }
        // }

        // return response
        console.log("cronjobForLiveCompetitions API run Successfully");
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error on cronjobForLiveCompetitions API', data: error.message });
    }
}

// this function will make an API call to the ENTITYSPORT and get all available matched based on competetionId and those status=upcoming"
exports.cronjobForUpcomingMatches = async (req, res) => {
    console.log("cronjobForUpcomingMatches::::step1");
    
    // get parameters and check for the required validation
    let sport_primary_key = false;
    let source_primary_key = false;
    let competetion_primary_key = false;

    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the match tables
    try {
        console.log("cronjobForUpcomingMatches::::step2");
        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }

    // Second; we are synching the competetions matches one by one
    try {
        console.log("cronjobForUpcomingMatches::::step3");       
            
        // We will get the competetion those status!=Live(Means it has running now)
        const competetionRecordsRows = await Competetion_Matches_Mapping.find({ active: 1, status: "upcoming" });
        
        const finalResponse = await Promise.all(competetionRecordsRows.map(async (row) => {
            console.log("cid", row.cid);
            const url = api_url + 'sync/competetionMatch?token=' + ENTITYSPORT_API_KEY + "&cid=" + row.cid;
            const response = await axios.get(url);
        }));
        
        console.log("cronjobForUpcomingMatches::::step12");
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data on cronjobForUpcomingMatches API' });
    }
}

// this function will make an API call to the ENTITYSPORT and get all available competetion automatically using cronjob
exports.cronjobForCompetetion = async (req, res) => {
    console.log("cronjobForCompetetion:::step1:::");
    
    // get parameters and check for the required validation
    let sport_primary_key = false;
    let source_primary_key = false;
    let competetion_primary_key = false;

    // first; we will get the primaryID details for the sport and source table 
    // so that we can pass these references to the match tables
    try {

        console.log("cronjobForCompetetion:::step2:::");
        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: sport_id});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: source_id});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }

    // now fetch entitysport data and save to our database
    try {
        
        // Step 1: fetch all seaons from our database and using them get all the available seasons
        const seasonsRows = await Season.find({status:true});
        const finalResponse = await Promise.all(seasonsRows.map(async (season) => {
            const url = ENTITYSPORT_API_URL + "seasons/" + season.name + "/" +'competitions';
            return await fetchEntitySportData(ENTITYSPORT_API_KEY, url, 100000);
        }));

        
        // Step 2: now iterating all api responses one by one so that all the items data may be iterate
        let resultSize = finalResponse?.length;
        if(resultSize > 0){
            finalResponse.map(async (response , i) => {
                if(response.status === "ok"){
                    const items = response.response.items;            
                    const updatedItems = items.map(item => {
                        return {
                            ...item,         // Spread existing properties
                            sport_id: sport_primary_key,  // Add a new property
                            source_id: source_primary_key // Add a new property
                        };
                    });   
        
                    // updating items on the response so that we may have sport & sourceId on each items
                    const bulkOps = updatedItems.map(item => ({
                        updateOne: {
                            filter: { cid: item.cid }, 
                            update: { $set: item }, 
                            upsert: true // Insert if not found
                        }
                    }));
                    
                    // preparing bulk update
                    const result = await Competetion.bulkWrite(bulkOps);

                    const itemsForUpdatingMappingTable = items.map(item => {
                        return {
                            cid: item.cid,         // Spread existing properties
                            status: item.status,         // Spread existing properties
                            fantasy_status: true,         // Spread existing properties
                            live_status: true,         // Spread existing properties
                            scorecard_status: true,         // Spread existing properties
                            squad_status: true,         // Spread existing properties
                            datestart: item.datestart,         // Spread existing properties
                            dateend: item.dateend,         // Spread existing properties
                            sport_id: sport_primary_key,  // Add a new property
                            source_id: source_primary_key // Add a new property
                        };
                    });
        
                    // updating items on the response so that we may have sport & sourceId on each items
                    const bulkOpsForUpdatingMappingTable = itemsForUpdatingMappingTable.map(item => ({
                        updateOne: {
                            filter: { cid: item.cid }, 
                            update: { $set: item }, 
                            upsert: true // Insert if not found
                        }
                    }));
                    
                    // preparing bulk update
                    const resultForUpdatingMappingTable = await Competetion_Matches_Mapping.bulkWrite(bulkOpsForUpdatingMappingTable);
                }
            })
        }

        // Step 3: send response
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data on cronjobForCompetetion' });        
    }

}

// this function will be use to sync fantasy details for all live matches
exports.cronjobFantasyDataForLiveMatches = async (req, res) => {
    try {
        // first, We will fetch those matches which status!=Live(Means it has running now)
        const matchesRows = await Match.find({ status_str: "Live" });

        // second, Iterate through each record and will sync their fantasy point
        const results = await Promise.all(matchesRows.map(async (row) => {
            try {
                await saveFantasyDataForLiveMatch(req, res, row.match_id); // Call the private function to save fantasy
            } 
            catch (apiError) {
                console.error('Error calling cronjobFantasyDataForLiveMatches API', apiError.message);
            }
        }));
        
        // retrun response
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

// this function will be use to sync live details for all live matches
exports.cronjobLiveDataForLiveMatches = async (req, res) => {
    try {
        // first, We will fetch those matches which status!=Live(Means it has running now)
        const matchesRows = await Match.find({ status_str: "Live" });

        // second, Iterate through each record and will sync their fantasy point
        for (const row of matchesRows) {
            try {
                await saveLiveDataForLiveMatch(req, res, row.match_id); // Call the private function to save fantasy
            } catch (apiError) {
                console.error('Error calling API for record:', 'Error:', apiError.message);
            }
        }
        
        // return response
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

// this function will be use to sync scorecard details for all live matches
exports.cronjobScorecardDataForLiveMatches = async (req, res) => {
    try {
        // first, We will fetch those matches which status!=Live(Means it has running now)
        const matchesRows = await Match.find({ status_str: "Live" });

        // second, Iterate through each record and will sync their fantasy point
        for (const row of matchesRows) {
            try {
                await saveScorecardDataForLiveMatch(req, res, row.match_id); // Call the private function to save fantasy
            } catch (apiError) {
                console.error('Error calling API for record:', 'Error:', apiError.message);
            }
        }
        
        // return response
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

// this function will be use to sync playing11 squads details for all live matches
exports.cronjobSquadsDataForLiveMatches = async (req, res) => {
    try {
        // first, We will fetch those matches which status!=Live(Means it has running now)
        const matchesRows = await Match.find({ status_str: "Live" });

        // second, Iterate through each record and will sync their fantasy point
        const results = await Promise.all(matchesRows.map(async (row) => {
            try {
                // console.log(row.match_id);
                await saveSquadsDataForLiveMatch(req, res, row.match_id);  // Call the private function to save squads
            } 
            catch (apiError) {
                console.error('Error calling cronjobFantasyDataForLiveMatches API', apiError.message);
            }
        }));
        
        // return response
        return res.status(200).json({status: 200, message: 'Sync Successfully.' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}





// Private function

const saveCompetitionMatches = async (req, res, cid = false) => {
    // check for the required validation
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!cid || !sport_primary_key || !source_primary_key ) {
        return res.status(404).json({status: 404, message: 'cid and sport_primary_key and source_primary_key not found' });
    }

    //  we are checking competition exist on the Table or not
    const competetionRow = await Competetion.findOne({cid: cid});
    if (!competetionRow) {
        return res.status(404).json({status: 404, message: 'Competetion not found' });
    }
    
    // calling api
    competetion_primary_key = competetionRow._id;
    competetion_cid = competetionRow.cid;
    const url = ENTITYSPORT_API_URL + 'competitions/' + competetion_cid + '/matches/';
    const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url, 1000);
    const apiData = response.response;
    if(apiData !== undefined && response.status === "ok" ) {
    
        // updating new items on the response so that we may have sport & sourceId on each items
        const items = response.response.items;
        const updatedItems = items.map(item => {
            return {
                ...item,         // Spread existing properties
                cid: competetion_cid,  // Add a new cid property
                competetion: competetion_primary_key,  // Add a new competetion property
                sport_id: sport_primary_key,  // Add a new sport_id property
                source_id: source_primary_key // Add a new source_id property
            };
        });

        // Prepare bulk operations
        const bulkOps = updatedItems.map(item => ({
            updateOne: {
                filter: { match_id: item.match_id }, 
                update: { $set: item }, 
                upsert: true // Insert if not found
            }
        }));

        // Execute bulk operations
        const result = await Match.bulkWrite(bulkOps);
    }
};

const saveFantasyDataForLiveMatch = async (req, res, match_id = false) => {
    
    // check for the required validation
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!match_id || !sport_primary_key || !source_primary_key ) {
        return res.status(404).json({status: 404, message: 'match_id and sport_primary_key and source_primary_key not found' });
    }

    //  we are checking match exist on the Match Table or not
    let matchRow = await Match.findOne({match_id: match_id});
    if (!matchRow) {
        return res.status(200).json({ status: 200, message: "Match does not exist for this match_id", data: [] });
    }

    //  we are also checking FantasyData exist for this Match or not; if not sync it else leave                
    const matchFantasyRow = await MatchFantasy.findOne({match_id: match_id});
    if (!matchFantasyRow) {
        // calling api    
        const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/newpoint2/';
        const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url);
        const apiData = response.response;
        
        if(apiData !== undefined && response.status === "ok" ) {
            // STEP 1: Additional source_id and sport_id fields, we want to include on the database
            const additionalFields = {
                sport_id: sport_primary_key,
                source_id: source_primary_key,
                match: matchRow._id,
                match_id: match_id
            };
            const dataToSave = { ...apiData, ...additionalFields };
            
            // Step 2: Check if the record already exists
            // insert or update the record accordingly
            const result = await MatchFantasy.updateOne({match_id: match_id}, { $set: dataToSave}, { upsert: true });
        }
    }
};


const saveLiveDataForLiveMatch = async (req, res, match_id = false) => {
    
    // check for the required validation
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!match_id || !sport_primary_key || !source_primary_key ) {
        return res.status(404).json({status: 404, message: 'match_id and sport_primary_key and source_primary_key not found' });
    }

    //  we are checking match exist on the Match Table or not
    let matchRow = await Match.findOne({match_id: match_id});
    if (!matchRow) {
        return res.status(200).json({ status: 200, message: "Match does not exist for this match_id", data: [] });
    }
    
    // calling api    
    const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/live/';
    const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url);
    const apiData = response.response;
    
    if(apiData !== undefined && response.status === "ok" ) {
        // STEP 1: Additional source_id and sport_id fields, we want to include on the database
        const additionalFields = {
            sport_id: sport_primary_key,
            source_id: source_primary_key,
            match: matchRow._id,
            match_id: match_id
        };
        const dataToSave = { ...apiData, ...additionalFields };
        
        // Step 2: Check if the record already exists
        // insert or update the record accordingly
        const result = await Matchlive.updateOne({match_id: match_id}, { $set: dataToSave}, { upsert: true });
    }
};

const saveScorecardDataForLiveMatch = async (req, res, match_id = false) => {
    
    // check for the required validation
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!match_id || !sport_primary_key || !source_primary_key ) {
        return res.status(404).json({status: 404, message: 'match_id and sport_primary_key and source_primary_key not found' });
    }

    //  we are checking match exist on the Match Table or not
    let matchRow = await Match.findOne({match_id: match_id});
    if (!matchRow) {
        return res.status(200).json({ status: 200, message: "Match does not exist for this match_id", data: [] });
    }
    
    // calling api
    const match = matchRow._id;
    const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/scorecard/';
    const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url);
    const apiData = response.response;
    if(apiData !== undefined && response.status === "ok" ) {
        // STEP 1: Additional source_id and sport_id fields, we want to include on the database
        const additionalFields = {
            sport_id: sport_primary_key,
            source_id: source_primary_key,
            cid: matchRow.cid,
            match: matchRow._id,
            match_id: match_id
        };
        const dataToSave = { ...apiData, ...additionalFields };
        
        // Step 2: Check if the record already exists and insert or update the record accordingly
        const result = await Matchscorecard.updateOne({match_id: match_id}, { $set: dataToSave}, { upsert: true });


        
        const key = 'cronjob_scorecard_data_for_live_matches';  // Redis key
        let myObject = {};
        myObject[apiData.match_id] = dataToSave;

        // Retrieve the JSON from Redis (parse the string back into an object)
        const redisResult = await redis.get(key);
        if (redisResult) {
            // Step 2: Parse the existing JSON object
            const existingData = JSON.parse(redisResult);
    
            // Step 3: Update the necessary key-value pairs
            Object.keys(myObject).forEach(userKey => {
                existingData[userKey] = myObject[userKey]; // Update or add user data
            });
    
            // Step 4: Store the updated JSON object back in Redis
            await redis.set(key, JSON.stringify(existingData));
            console.log('Updated data stored in Redis:');
    
          } else {
            console.log('No data found for key:', key);
            redis.del(key);
            // Store JSON in Redis (serialize the object to a string)
            await redis.set(key, JSON.stringify(myObject));
        }
    }
};

const saveSquadsDataForLiveMatch = async (req, res, match_id = false) => {
    
    // check for the required validation
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!match_id || !sport_primary_key || !source_primary_key ) {
        return res.status(404).json({status: 404, message: 'match_id and sport_primary_key and source_primary_key not found' });
    }

    //  we are checking match exist on the Match Table or not
    let matchRow = await Match.findOne({match_id: match_id});
    if (!matchRow) {
        return res.status(200).json({ status: 200, message: "Match does not exist for this match_id", data: [] });
    }

    //  we are also checking squadData exist for this Match or not; if not sync it else leave
    const matchsquadRow = await Matchsquad.findOne({match_id: match_id});
    if (!matchsquadRow) {
        // calling api    
        const url = ENTITYSPORT_API_URL + 'matches/' + match_id + '/squads/';
        const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url);
        const apiData = response.response;
        if(apiData !== undefined && response.status === "ok" ) {
            // STEP 1: Additional source_id and sport_id fields, we want to include on the database
            const additionalFields = {
                sport_id: sport_primary_key,
                source_id: source_primary_key,
                match: matchRow._id,
                match_id: match_id
            };
            const dataToSave = { ...apiData, ...additionalFields };
            
            // Step 2: Check if the record already exists and insert or update the record accordingly
            const result = await Matchsquad.updateOne({match_id: match_id}, { $set: dataToSave}, { upsert: true });
        }
    }
};

const saveCompetetionStandingsDataForLiveMatch = async (req, res, cid = false) => {
    
    // check for the required validation
    const sport_primary_key = req.query.sport_primary_key;
    const source_primary_key = req.query.source_primary_key;
    if (!cid || !sport_primary_key || !source_primary_key ) {
        return res.status(404).json({status: 404, message: 'cid and sport_primary_key and source_primary_key not found' });
    }

    //  we are checking competetion exist on the competetions Table or not
    let competetionRow = await Competetion.findOne({cid: cid});
    if (!competetionRow) {
        return res.status(404).json({ status: 404, message: "competetion does not exist for this cid", data: [] });
    }
    
    // calling api
    const url = ENTITYSPORT_API_URL + 'competitions/' + cid + '/standings/';
    const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url);
    const apiData = response.response;
    if(apiData !== undefined && response.status === "ok" ) {
        // STEP 1: Additional fields, we want to include on the database
        const additionalFields = {
            sport_id: sport_primary_key,
            source_id: source_primary_key,
            competetion: competetionRow._id,
            cid: cid
        };
        const dataToSave = { ...apiData, ...additionalFields };
        
        // Step 2: Check if the record already exists and insert or update the record accordingly
        const result = await Competetion_Standing.updateOne({cid: cid}, { $set: dataToSave}, { upsert: true });
    }
};
