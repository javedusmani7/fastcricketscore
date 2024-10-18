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


