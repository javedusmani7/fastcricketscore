const axios = require('axios');
const mongoose = require('mongoose');
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

// predefine constant values
const ENTITYSPORT_API_URL = process.env.ENTITYSPORT_API_URL;
const sport_id = process.env.CRICKET_SPORT_ID;
const source_id = process.env.ENTITYSPORT_API_SOURCE_ID;


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

    const result = await Source.insertMany([  
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
    ]);

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

// START: Private Methods from Here
