const axios = require('axios');
const mongoose = require('mongoose');
// mongoose.set('debug', true);
require('dotenv').config();


// load models 
const Season = require('../models/Season');
const Competetion = require('../models/Competetion');
const Match = require('../models/Match');


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
        console.error(error);
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
        console.error(error);
        res.status(500).json({ message: 'adminController:: Error in getMatches API' });
    }
}
