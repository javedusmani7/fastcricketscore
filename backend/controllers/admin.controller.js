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


exports.getCompetetions = async (req, res) => {
    const { cid, page = 1, limit = 10 } = req.query; // Get competition_id from query parameters

    // Parse page and limit as numbers (default to 1 and 10 respectively)
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    console.log(pageNumber);
    console.log(pageLimit);

    try {
        if (cid) {
            const competitionRow = await Competetion.find({ cid });
      
            if (competitionRow.length < 1) {
              return res.status(404).json({ status: 400, message: 'Competition not found' });
            }
      
                
            return res.status(200).json({
                status: 200,
                message: "Competition retrieved successfully.",
                data: competitionRow
            });
        }

        // Calculate the number of records to skip based on the page and limit
        const skip = (pageNumber - 1) * pageLimit;
      
        // If no competition_id, return all competitions
        const competitionsrows = await Competetion.find().skip(skip).limit(pageLimit);

        // Get total count of competitions for pagination info
        const totalCompetitions = await Competetion.countDocuments();

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
