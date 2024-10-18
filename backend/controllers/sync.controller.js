const axios = require('axios');

require('dotenv').config();


// load models 

const Sport = require('../models/Sport');
const Source = require('../models/Source');
const Season = require('../models/Season');
const Competetion = require('../models/Competetion');

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


exports.syncCompetetionList = async (req, res) => {
    try {
        const token = req.query.token;
        const season = "2024";
    
        const response = await fetchCompetetionDataFromEntitySport(token , ENTITYSPORT_API_URL + "seasons/" + season + "/" +'competitions');

        if(response.status == "unauthorized" || response.status == "forbidden"){
            res.status(200).json({ status : false , message: 'Error fetching data from Entitysport API' });
        }else{


            const items = response.response.items;
            const bulkOps = items.map(item => ({
                updateOne: {
                    filter: { cid: item.cid }, 
                    update: { $set: item }, 
                    upsert: true // Insert if not found
                }
            }));
            

            const result = await Competetion.bulkWrite(bulkOps);

            if(result){
                res.status(200).json({ status : true , message: response.response });
            }else{
                res.status(200).json({ status : false , message: "Problem in Insert" });
            }
            
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.syncCompetetion = async (req, res) => {
    try {
        const token = req.query.token;
        const competetionId = req.query.cid;

        console.log();
        const response = await fetchCompetetionDataFromEntitySport(token , ENTITYSPORT_API_URL + 'competitions/' + competetionId);
        
        if(response.status == "unauthorized" || response.status == "forbidden"){
            res.status(200).json({ status : false , message: 'Error fetching data from Entitysport API' });
        }else{
            res.status(200).json({ status : true , message: response.response });
        }
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



// Private method for making a third-party API call for getting the competetionList details
const fetchCompetetionDataFromEntitySport = async (token , url) => {
    try {
        const response = await axios({
          method: "get", 
          url: url,
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


const fetchCompetetionDataFromCricketLiveLine= async (token , url) => {
    try {
        const response = await axios({
          method: "get", 
          url: url,
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