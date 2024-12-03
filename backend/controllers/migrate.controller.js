const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// load models
const Competetion = require('../models/Competetion');
const Match = require('../models/Match');
const MatchFantasy = require('../models/MatchFantasy');
const Matchlive = require('../models/Matchlive');
const Matchscorecard = require('../models/Matchscorecard');
const Matchsquad = require('../models/Matchsquad');

// load older models
const Older_Competition = require('../models/older/Competition');
const Older_Match = require('../models/older/Match');
const Older_MatchFantasy = require('../models/older/MatchFantasy');
const Older_Matchlive = require('../models/older/Matchlive');
const Older_Matchscorecard = require('../models/older/Matchscorecard');
const Older_Matchsquad = require('../models/older/Matchsquad');


exports.getMigrateOldData = async (req, res) => {

    // STEP 1: First migrating on the competetion collection
    try {
        // await migrateCompetition();
    }
    catch (error) {
        res.status(500).json({ message: 'Error on Migrating Competitions Data.', data: error.message });
    }

    // STEP 2: Second migrating all matches data
    try {
        // await migrateMatches();
    } 
    catch (error) {
        res.status(500).json({ message: 'Error on Migrating Matches Data.', data: error.message });
    }

    // STEP 3: Thirdly, migrating all matches Fantasy data
    try {
        // await migrateMatchFantasy();
    } 
    catch (error) {
        res.status(500).json({ message: 'Error on Migrating MatchFantasy Data.', data: error.message });
    }

    // STEP 4: migrating all matches live data
    try {
        await migrateMatchLive();
    } 
    catch (error) {
        res.status(500).json({ message: 'Error on Migrating MatchFantasy Data.', data: error.message });
    }

    // STEP 5: migrating all matches scorecard data
    try {
        await migrateMatchScorecard();
    } 
    catch (error) {
        res.status(500).json({ message: 'Error on Migrating MatchFantasy Data.', data: error.message });
    }

    // STEP 5: migrating all matches scorecard data
    try {
        await migrateMatchSquads();
    } 
    catch (error) {
        res.status(500).json({ message: 'Error on Migrating MatchFantasy Data.', data: error.message });
    }

    // final response
    return res.status(200).json({ status: 200, message: "Data Migrated Successfully."});  
}



// Private function START FROM HERE

/**
 * API Method will be use to migrate all competetion collection data
 * @param {*} req 
 * @param {*} res 
 * @param {*} cid 
 */
const migrateCompetition = async (req, res, cid = false) => {
     try {
        // Get the current date and subtract one month
        // Convert the date one month ago into "YYYY-MM-DD" format for comparison
        const currentDate = new Date();
        const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];  // "YYYY-MM-DD"

        // Query the collection for records where datestart is less than the calculated date
        const competetionRows = await Competetion.find({datestart: { $lte: oneMonthAgoStr } });
        if (competetionRows.length > 0) {
            // Insert the records into the new collection
            // Remove the moved records from the original collection
            await Older_Competition.insertMany(competetionRows);
            await Competetion.deleteMany({datestart: { $lte: oneMonthAgoStr } });         
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error on migrateCompetition Method.', data: error.message });
    }
}

/**
 * API Method will be use to migrate matches collection data
 * @param {*} req 
 * @param {*} res 
 * @param {*} cid 
 */
const migrateMatches = async (req, res, cid = false) => {
    try {
        // Get the current date and subtract 1 month to get the timestamp for 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoTimestamp = Math.floor(oneMonthAgo.getTime() / 1000); // Convert to Unix timestamp in seconds

        // Query the collection for records where timestamp_start is less than the calculated timestamp
        const oldMatchRecords = await Match.find({ timestamp_start: { $lt: oneMonthAgoTimestamp } });
        if (oldMatchRecords.length > 0) {
            // Insert the records into the new collection
            // Prepare and Execute bulk operations
            const bulkOps = oldMatchRecords.map(item => ({ updateOne: {filter: { match_id: item.match_id }, update: { $set: item }, upsert: true }}));
            const result = await Older_Match.bulkWrite(bulkOps);

            // Remove the moved records from the original collection
            await Match.deleteMany({ timestamp_start: { $lt: oneMonthAgoTimestamp } });                    
        }
   }
   catch (error) {
       res.status(500).json({ message: 'Error on migrateMatches Method.', data: error.message });
   }
}

/**
 * API Method will be use to migrate MatchFantasy collection data
 * @param {*} req 
 * @param {*} res 
 * @param {*} cid 
 */
const migrateMatchFantasy = async (req, res, cid = false) => {
    try {
        // Get the current date and subtract 1 month to get the timestamp for 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoTimestamp = Math.floor(oneMonthAgo.getTime() / 1000); // Convert to Unix timestamp in seconds

        // Query the collection for records where timestamp_start is less than the calculated timestamp
        const oldMatchFantasyRecords = await MatchFantasy.find({ timestamp_start: { $lt: oneMonthAgoTimestamp } });
        if (oldMatchFantasyRecords.length > 0) {
            // Insert the records into the new collection
            // Prepare and Execute bulk operations
            const bulkOps = oldMatchFantasyRecords.map(item => ({ updateOne: {filter: { match_id: item.match_id }, update: { $set: item }, upsert: true }}));
            const result = await Older_MatchFantasy.bulkWrite(bulkOps);

            // // Remove the moved records from the original collection
            await MatchFantasy.deleteMany({ timestamp_start: { $lt: oneMonthAgoTimestamp } });                    
        }
   }
   catch (error) {
       res.status(500).json({ message: 'Error on migrateMatches Method.', data: error.message });
   }
}

/**
 * API Method will be use to migrate MatchLive collection data
 * @param {*} req 
 * @param {*} res 
 * @param {*} cid 
 */
const migrateMatchLive = async (req, res, cid = false) => {
    try {
        // Get the current date and subtract 1 month to get the timestamp for 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoTimestamp = Math.floor(oneMonthAgo.getTime() / 1000); // Convert to Unix timestamp in seconds

        const oldMatchLiveRecords = await Matchlive.aggregate([
            {
              // Step 1: Perform the lookup to join matchlive with match collection
              $lookup: {
                from: "matches",          // The collection to join with
                localField: "match", // Field in matchlive that references the match collection
                foreignField: "_id",    // Field in the match collection (usually ObjectId)
                as: "matchDetails"      // The field to store the matched documents from the match collection
              }
            },
            { $unwind: "$matchDetails"},
            {
              // Step 3: Filter based on the match date
              $match: {
                "matchDetails.timestamp_start": {
                  $lt: oneMonthAgoTimestamp  // Match date older than 1 month
                }
              }
            }
          ]);


        // Query the collection for records where timestamp_start is less than the calculated timestamp
        if (oldMatchLiveRecords.length > 0) {
            // Insert the records into the new collection
            // Prepare and Execute bulk operations
            const bulkOps = oldMatchLiveRecords.map(item => ({ updateOne: {filter: { match_id: item.match_id }, update: { $set: item }, upsert: true }}));
            const result = await Older_Matchlive.bulkWrite(bulkOps);

            // // Remove the moved records from the original collection
            // Extract the _id values from the aggregation result
            const childIdsToDelete = oldMatchLiveRecords.map(child => child._id);
            if(childIdsToDelete.length > 0){
                await Matchlive.deleteMany({ _id: { $in: childIdsToDelete  } }); 
            }                   
        }
   }
   catch (error) {
       res.status(500).json({ message: 'Error on migrateMatchLive Method.', data: error.message });
   }
}

/**
 * API Method will be use to migrate MatchSquad collection data
 * @param {*} req 
 * @param {*} res 
 * @param {*} cid 
 */
const migrateMatchSquads = async (req, res, cid = false) => {
    try {
        // Get the current date and subtract 1 month to get the timestamp for 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoTimestamp = Math.floor(oneMonthAgo.getTime() / 1000); // Convert to Unix timestamp in seconds

        const oldMatchSquadsRecords = await Matchsquad.aggregate([
            {
              // Step 1: Perform the lookup to join matchlive with match collection
              $lookup: {
                from: "matches",          // The collection to join with
                localField: "match", // Field in Matchsquad that references the match collection
                foreignField: "_id",    // Field in the match collection (usually ObjectId)
                as: "matchDetails"      // The field to store the matched documents from the match collection
              }
            },
            { $unwind: "$matchDetails"},
            {
              // Step 3: Filter based on the match date
              $match: {
                "matchDetails.timestamp_start": {
                  $lt: oneMonthAgoTimestamp  // Match date older than 1 month
                }
              }
            }
          ]);


        // Query the collection for records where timestamp_start is less than the calculated timestamp
        console.log(oldMatchSquadsRecords.length);
        if (oldMatchSquadsRecords.length > 0) {
            // Insert the records into the new collection
            // Prepare and Execute bulk operations
            const bulkOps = oldMatchSquadsRecords.map(item => ({ updateOne: {filter: { match_id: item.match_id }, update: { $set: item }, upsert: true }}));
            const result = await Older_Matchsquad.bulkWrite(bulkOps);

            // // Remove the moved records from the original collection
            // Extract the _id values from the aggregation result
            const childIdsToDelete = oldMatchSquadsRecords.map(child => child._id);
            if(childIdsToDelete.length > 0){
                await Matchsquad.deleteMany({ _id: { $in: childIdsToDelete  } }); 
            }                   
        }
   }
   catch (error) {
       res.status(500).json({ message: 'Error on migrateMatchLive Method.', data: error.message });
   }
}

/**
 * API Method will be use to migrate MatchScorecard collection data
 * @param {*} req 
 * @param {*} res 
 * @param {*} cid 
 */
const migrateMatchScorecard = async (req, res, cid = false) => {
    try {
        // Get the current date and subtract 1 month to get the timestamp for 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoTimestamp = Math.floor(oneMonthAgo.getTime() / 1000); // Convert to Unix timestamp in seconds

        // Query the collection for records where timestamp_start is less than the calculated timestamp
        const oldMatchScorecardRecords = await Matchscorecard.find({ timestamp_start: { $lt: oneMonthAgoTimestamp } });
        if (oldMatchScorecardRecords.length > 0) {
            // Insert the records into the new collection
            // Prepare and Execute bulk operations
            const bulkOps = oldMatchScorecardRecords.map(item => ({ updateOne: {filter: { match_id: item.match_id }, update: { $set: item }, upsert: true }}));
            const result = await Older_Matchscorecard.bulkWrite(bulkOps);

            // Remove the moved records from the original collection
            await Matchscorecard.deleteMany({ timestamp_start: { $lt: oneMonthAgoTimestamp } });                    
        }
   }
   catch (error) {
       res.status(500).json({ message: 'Error on migrateMatchScorecard Method.', data: error.message });
   }
}