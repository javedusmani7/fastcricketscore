const axios = require('axios');
const mongoose = require('mongoose');
// mongoose.set('debug', true);
require('dotenv').config();
const Schedular = require('../utils/cronJob'); 


// load models 
const Sport = require('../models/Sport');
const Source = require('../models/Source');
const Season = require('../models/Season');
const Competetion = require('../models/Competetion');
const Match = require('../models/Match');
const Interval = require('../models/Interval');
const { fetchEntitySportData } = require('../utils/EntitySports.util');

// predefine constant values
const ENTITYSPORT_API_KEY = process.env.ENTITYSPORT_API_KEY;
const ENTITYSPORT_API_URL = process.env.ENTITYSPORT_API_URL;
const ENTITYSPORT_API_SOURCE_ID = process.env.ENTITYSPORT_API_SOURCE_ID;
const CRICKET_SPORT_ID = process.env.CRICKET_SPORT_ID;


// this function will make an API call on our seasons table and get all available seasons
exports.getSeasons = async (req, res) => {
    try {
        const seasonsRows = await Season.find(); // Fetch all Seasons

        // json data for returning response
        return res.status(200).json({
            status: 200,
            message: "Seasons retrieved successfully.",
            data: seasonsRows
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}

/**
 * this API will update the Seasons table "status" field data 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateSeasonStatus = async (req, res) => {
    const sid = req.params.sid;
    const { status } = req.body;

    // check status validation
    if (typeof status !== 'boolean') {
        return res.status(400).json({ status: 400, message: "Status must be a boolean", data: [] });
    }

    try {
        // find all interval is exist or not
        const seasonRow = await Season.findOne({sid: sid});
        if (!seasonRow) {
            return res.status(400).json({ status: 400, message: "Season does not exist for this sid", data: [] });
        }

        // Update the status field
        seasonRow.status = status;
        await seasonRow.save();
        
        return res.status(200).json({
            status: 200,
            message: "Season status updated successfully.",
            data: seasonRow
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in updateSeasonStatus API' });
    }
}


/**
 * This API will return all the avaialable competetion records
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getCompetitions = async (req, res) => {
    const { sid, cid, title, status, page = 1, limit = 10 } = req.query; // Get competition_id from query parameters

    // Parse page and limit as numbers (default to 1 and 10 respectively)
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    try {
         // Construct the filter object for the query
        let filter = {};
        if (sid) { filter.season = sid;  } // Filter by cid if provided
        if (cid) { filter.cid = cid;  } // Filter by cid if provided
        if (title) { filter.title = { $regex: title, $options: 'i' }; } // 'i' for case-insensitive matching
        if (status) { filter.status = status; }  // Filter by status if provided

        // Calculate the number of records to skip based on the page and limit
        const skip = (pageNumber - 1) * pageLimit;
      
        // If no competition_id, return all competitions
        const competitionsrows = await Competetion.find(filter).skip(skip).limit(pageLimit);

        // Get total count of competitions for pagination info
        const totalCompetitions = await Competetion.countDocuments(filter);

        // json data for returning response
        return res.status(200).json({
            status: 200,
            message: "Competitions retrieved successfully.",
            page: pageNumber,
            limit: pageLimit,
            total: totalCompetitions,
            totalPages: Math.ceil(totalCompetitions / pageLimit),
            data: competitionsrows
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in getCompetetions API' });
    }
}



exports.updateCompetition = async (req, res) => {
    const cid = req.params.cid;
    const updatedFields = req.body;
    // Check if updatedFields is empty
    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ status: 400, message: "No fields provided to update - Please provide fields.", data: []  });
    }

    try {
        // Step 1: find Competetion exist or not for this cid
        const competitionRow = await Competetion.findOne({cid: cid});
        if (!competitionRow) {
            return res.status(400).json({ status: 400, message: "Competetion does not exist for this cide.", data: []  });
        }

        // Step 2: Save the updated document
        const updatedCompetitionRow = await Competetion.findByIdAndUpdate(competitionRow._id, updatedFields, {
            new: true,  // Return the updated document
            runValidators: true  // Ensure validation rules are followed
        });
        
        // Step 3: return response
        return res.status(200).json({
            status: competitionRow._id,
            message: "Competetion has been updated successfully.",
            data: updatedCompetitionRow
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in updateCompetition API', data: error.message });
    }
}


exports.synccompetitionMatchesByCid = async (req, res) => {
    const { cid} = req.query; // Get cid from query parameters
    if (!cid) { return res.status(400).json({ status: 400, message: "cid is required.", data: [] }); }

    try {
        // save Competetion Matches Data
        const results = await saveAdminCompetitionMatches(req, res, cid);
        if(!results){
            return res.status(200).json({
                status: 200,
                data: results ? results : "Competetion Matches data has been synced successfully." 
            });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in getCompetetions API' });
    }
}

/**
 * This API will return all the avaialable matches records
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getMatches = async (req, res) => {
    const { cid, title, status_str, page = 1, limit = 10 } = req.query; // Get competition_id from query parameters

    // Parse page and limit as numbers (default to 1 and 10 respectively)
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    try {
         // Construct the filter object for the query
        let filter = {};
        if (cid) { filter.cid = cid;  } // Filter by cid if provided
        if (title) { filter.title = { $regex: title, $options: 'i' }; } // 'i' for case-insensitive matching
        if (status_str) { filter.status_str = status_str; }  // Filter by status_str if provided

        // Calculate the number of records to skip based on the page and limit
        const skip = (pageNumber - 1) * pageLimit;
      
        // If no competition_id, return all competitions
        const matchesRows = await Match.find(filter).skip(skip).limit(pageLimit);

        // Get total count of competitions for pagination info
        const totalMatches = await Match.countDocuments(filter);

        // json data for returning response
        return res.status(200).json({
            status: 200,
            message: "Matches retrieved successfully.",
            page: pageNumber,
            limit: pageLimit,
            total: totalMatches,
            totalPages: Math.ceil(totalMatches / pageLimit),
            data: matchesRows
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in getMatches API' });
    }
}



exports.updateMatch = async (req, res) => {
    const match_id = req.params.match_id;
    const updatedFields = req.body;
    // Check if updatedFields is empty
    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ status: 400, message: "No fields provided to update - Please provide fields.", data: []  });
    }

    try {
        // Step 1: find match exist or not for this match_id
        const matchRow = await Match.findOne({match_id: match_id});
        if (!matchRow) {
            return res.status(400).json({ status: 400, message: "Match does not exist for this match_id.", data: []  });
        }

        // Step 2: Save the updated document
        const updatedMatchRow = await Match.findByIdAndUpdate(matchRow._id, updatedFields, {
            new: true,  // Return the updated document
            runValidators: true  // Ensure validation rules are followed
        });
        
        // Step 3: return response
        return res.status(200).json({
            status: 200,
            message: "Match has been updated successfully.",
            data: updatedMatchRow
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in updateMatch API', data: error.message });
    }
}

exports.getIntervals = async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query; // Get intervals from query parameters

    // Parse page and limit as numbers (default to 1 and 10 respectively)
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    try {
         // Construct the filter object for the query
        let filter = {};
        if (name) { filter.name = { $regex: name, $options: 'i' }; } // 'i' for case-insensitive matching

        // Calculate the number of records to skip based on the page and limit
        const skip = (pageNumber - 1) * pageLimit;
      
        // return all intervals
        const intervalsRows = await Interval.find(filter).skip(skip).limit(pageLimit);

        // Get total count of competitions for pagination info
        const totalMatches = await Interval.countDocuments(filter);

        // json data for returning response
        return res.status(200).json({
            status: 200,
            message: "Interval retrieved successfully.",
            page: pageNumber,
            limit: pageLimit,
            total: totalMatches,
            totalPages: Math.ceil(totalMatches / pageLimit),
            data: intervalsRows
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in getIntervals API' });
    }
}



exports.updateInterval = async (req, res) => {
    const key = req.params.key;
    const { time, status } = req.body;

    // Validate status validation
    if (status && typeof status !== 'boolean') {
        return res.status(400).json({ status: 400, message: "Status must be a boolean", data: [] });
    }

    // Validate time
    if (time && typeof time !== 'number') {
        return res.status(400).json({ error: 'Time must be a number' });
    }

    try {
        // Step 1: find interval exist or not for this key
        const intervalRow = await Interval.findOne({key: key});
        if (!intervalRow) {
            return res.status(400).json({ status: 400, message: "Interval does not exist for this key", data: []  });
        }

         // Step 2: update the status field and the time field (if provided)
        if (status) { intervalRow.status = status; } // Only update if status is provided
        if (time) { intervalRow.time = time; }       // Only update if time is provided

        // Step 3: Save the updated document
        await intervalRow.save();
        
        // Step 4: return response
        return res.status(200).json({
            status: 200,
            message: "Interval updated successfully.",
            data: intervalRow
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'adminController:: Error in updateInterval API' });
    }
}












// Private function

const saveAdminCompetitionMatches = async (req, res, cid = false) => {
    let sport_primary_key = false;
    let source_primary_key = false;
    
    // first; we will get the primaryID details for the sport, source and competetion table 
    // so that we can pass these references to the match tables
    try {

        // check if the sports exists or not
        const sportRow = await Sport.findOne({sport_id: CRICKET_SPORT_ID});
        if (!sportRow) {
            return res.status(404).json({status: 404, message: 'Sport not found' });
        }
        sport_primary_key = sportRow._id;

        // check if the source exists or not
        const sourceRow = await Source.findOne({source_id: ENTITYSPORT_API_SOURCE_ID});
        if (!sourceRow) {
            return res.status(404).json({status: 404, message: 'Source not found' });
        }
        source_primary_key = sourceRow._id;
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }


    try{
        // check for the required validation
        if (!cid || !sport_primary_key || !source_primary_key ) {
            return res.status(404).json({status: 404, message: 'cid or sport_primary_key or source_primary_key not found', data: [] });
        }

        //  we are checking competition exist on the Table or not
        const competetionRow = await Competetion.findOne({cid: cid});
        if (!competetionRow) {
            return res.status(404).json({status: 404, message: 'Competetion not found', data: []  });
        }
        
        // calling api
        const competetion_primary_key = competetionRow._id;
        const competetion_cid = competetionRow.cid;
        const url = ENTITYSPORT_API_URL + 'competitions/' + competetion_cid + '/matches/';
        const response = await fetchEntitySportData(ENTITYSPORT_API_KEY, url, 1000);
        const apiData = response.response;
        if(apiData !== undefined && response.status === "ok" ) {
        
            // updating new items on the response so that we may have sport & sourceId on each items
            const items = response.response.items;
            const updatedItems = items.map(item => {
                const tez_id = competetion_cid + "-" + item.match_id;
                return {
                    ...item,         // Spread existing properties
                    tej_match_id : tez_id,  // Add a new tej_match_id property
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data from Source and Sport Table. ' });
    }
};