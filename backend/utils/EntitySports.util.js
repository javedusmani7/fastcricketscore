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

function testFunction() {
    return true;
}

module.exports = {
    fetchEntitySportData,
    testFunction
};

