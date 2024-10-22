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

    // // Making an api call from Entity sports and then saving into our database
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



// this function will make an API call on our competetionlist according to sport and season

exports.getCompetetionList = async (req, res) => {
    console.log("Inside getCompetetions API call");
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
                    foreignField: 'cid', // The field from the Customers collection
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


