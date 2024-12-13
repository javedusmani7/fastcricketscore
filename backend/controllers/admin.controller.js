const axios = require('axios');
const mongoose = require('mongoose');
// mongoose.set('debug', true);
require('dotenv').config();


// load models 
const Season = require('../models/Season');
const Competetion = require('../models/Competetion');
const Match = require('../models/Match');
const Interval = require('../models/Interval');


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
exports.getCompetetions = async (req, res) => {
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