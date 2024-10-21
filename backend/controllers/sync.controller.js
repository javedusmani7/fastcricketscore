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
const { fetchEntitySportData } = require('../utils/EntitySports.util');

// predefine constant values
const ENTITYSPORT_API_URL = process.env.ENTITYSPORT_API_URL;
const sport_id = process.env.CRICKET_SPORT_ID;
const source_id = process.env.ENTITYSPORT_API_SOURCE_ID;




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



// START: Private Methods from Here
