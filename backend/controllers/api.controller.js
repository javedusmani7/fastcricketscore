const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();


// load models 
const Sport = require('../models/Sport');
const Source = require('../models/Source');
const Season = require('../models/Season');
const Competetion = require('../models/Competetion');
const Match = require('../models/Match');


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



// this function will make an API call on our competetionlist according to sport and season

exports.getCompetetionList = async (req, res) => {
    console.log("Inside getCompetetions API call");
    // // Making an api call from Entity sports and then saving into our database
    try {
        const competetionRows = await Competetion.find({}); // Fetch all competetions

        function formatDate(dateStr) {
            const options = { month: 'short', day: 'numeric' };
            return new Date(dateStr).toLocaleString('default', options);
        }

        function formatCountString(format, count) {
            const formatUpper = format.toUpperCase();
            return count === 1 ? `1 ${formatUpper}` : `${count} ${formatUpper}s`;
        }

        const result = {};

        // Iterate over each competition in the database
        competetionRows.forEach((competition) => {
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
            result[monthYear].push({
                id: competition._id,
                title: competition.title,
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
            data: result
        }
        
        res.json(response);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Our Records' });
    }
}


