const axios = require('axios');
const mongoose = require('mongoose');
const Interval = require('../models/Interval');

// predefine constant values
require('dotenv').config();
let intervals = {}; // Store multiple intervals with their IDs

/**
*  NEW CHANGES AFTER 8 December MEETING 
*/

// this function will return all the available records from the interval collection
const getAllIntervals = async () => {
    let newObject = {};
    const results =  await Interval.find({ status: true });
    if (results.length > 0) {
        results.forEach(result => {
            newObject[result.key] = result;
        });
    }
    
    // return response
    return newObject;
}

// Function to make API calls
async function callApi(apiUrl) {
  try {
    const response = await axios.get(apiUrl); // API URL as parameter
    if (response.status >= 200 && response.status < 300) {
        console.log("callApi:::: API executed successfully.");
    }
  } catch (error) {
    console.log("callApi:: Error in executing API.", error.message);
  }
}

// Function to start dynamic intervals
exports.startInterval = async (name, intervalTime, apiUrl) => {
// function startInterval(name, intervalTime, apiUrl) {
  if (intervals[name]) {
    clearInterval(intervals[name].id); // Clear existing interval
  }

  intervals[name] = {
    time: intervalTime,
    apiUrl: apiUrl,
    id: setInterval(async () => {
      console.log(`${name} Triggered at ${intervalTime}`);
      await callApi(apiUrl); // Make API call for this interval
    }, intervalTime)
  };
}

// Function to change the interval time dynamically for a specific interval
exports.changeIntervalTime = async (name, newIntervalTime) => {
// function changeIntervalTime(name, newIntervalTime) {
  if (intervals[name]) {

    // Clear the interval with the new time
    clearInterval(intervals[name].id); // Clear the existing interval
    intervals[name].time = newIntervalTime; // Update the time

    // Restart the interval with the new time
    this.startInterval(name, newIntervalTime, intervals[name].apiUrl);
  }
}


// this function will execute all the available crons/interval which is stored in the database
const runAllInterval = async () => {
    try {
        const intervalsRows = await getAllIntervals();
        if(Object.entries(intervalsRows).length > 0){
            Object.entries(intervalsRows).forEach(([key, interval]) => {
                this.startInterval(key, interval['time'], interval['api_url']);
            });
        }
    }
    catch (error) {
        console.error('Error runAllInterval Cronjob:', error);
    }
};
// runAllInterval();

// Start dynamic intervals for multiple APIs
// setInterval(executeJobBasedOnTime, 50000);
// this.startInterval('apiInterval1', 5000, 'javed');
// startInterval('apiInterval1', 5000, 'javed');
// startInterval('apiInterval2', 10000, 'https://api.example2.com/2');
// startInterval('apiInterval3', 15000, 'https://api.example3.com/3');

// Example: Dynamically change the interval time for the first API after 5 seconds
// setTimeout(() => {
//     this.changeIntervalTime('apiInterval1', 2000);
// //   changeIntervalTime('apiInterval1', 2000); // Change to 5 seconds
// }, 5000);


