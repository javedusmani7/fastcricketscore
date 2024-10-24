const axios = require('axios');

const fetchEntitySportData = async (token, url, per_page = 10, paged = 1) => {
    try {

        // token and url validation
        if (!url || !token ) {
            return { status: 401, message: 'token and url paramater is missing, these are required.' }
        }

        // making an http request to get the details
        const response = await axios({
          method: "get", 
          url: url,
          params: {
            token: token,
            per_page: per_page,
            paged: paged
          },
        });
        return response.data;
    } 
    catch (error) {
      // retrun error
      return error.response.data;
    }
};

const fetchEntitySportPlayersProfile = async (token, url, per_page = 1000, paged = 1) => {
  let allItems = [];
  let page = 1;

  // token and url validation
  if (!url || !token ) {
      return { status: 401, message: 'token and url paramater is missing, these are required.' }
  }

  try {
    while (true) {
      
          // making an http request to get the details
          const response = await axios({
            method: "get", 
            url: url,
            params: {
              token: token,
              per_page: per_page,
              paged: paged
            },
          });
          const items = response.data.response.items;
          const total_pages = response.data.response.total_pages? response.data.response.total_pages : 10000;

          // // Add the fetched items to the allItems array
          allItems = allItems.concat(items);

          // // Check if we've reached the last page
          // if (page == total_pages) {
          // if (page > 10) {
          if (page == total_pages) {
              break; // Exit the loop if fewer than 1000 items were returned
          }
          page++; // Increment the page for the next request
          // console.log(allItems.length, ":::::page:::::", page);
    }
    // console.log(allItems.length);
    return allItems;

  }
  catch (error) {
      console.error('Error fetching fetchEntitySportPlayersProfile items:', error);
      return error;
      // break; // Exit the loop on error
  }
};

function testFunction() {
    return true;
}

module.exports = {
    fetchEntitySportData,
    fetchEntitySportPlayersProfile,
    testFunction
};

