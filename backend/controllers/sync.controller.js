const axios = require('axios');
const Season = require('../models/Season');
require('dotenv').config();

// predefine constant values
const ENTITYSPORT_API_URL = process.env.ENTITYSPORT_API_URL;


// this function will make an API call to the ENTITYSPORT and get all available seasons
// once we get it, it will store to the database
exports.syncSeason = async (req, res) => {
    try {
        const token = req.query.token;
        const response = await fetchSeasonDataFromEntitySport(token);

         // Prepare bulk operations
        const items = response.response.items;
        const bulkOps = items.map(item => ({
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


exports.syncCompetetion = async (req, res) => {
    try {
        const token = req.query.token;
        const response = await axios({
            method: "get", 
            url: ENTITYSPORT_API_URL + 'competitions',
            params: {
              token: token,
            },
          });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
}


// START: Private Methods from Here

// Private method for making a third-party API call for getting the seasons details
const fetchSeasonDataFromEntitySport = async (token) => {
    try {
        const response = await axios({
          method: "get", 
          url: ENTITYSPORT_API_URL + 'seasons',
          params: {
            token: token,
          },
        });
        return response.data;
    } 
    catch (error) {
      // retrun error
      return error.response.data;
    }
};