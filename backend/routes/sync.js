const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const ENTITYSPORT_API_URL = process.env.ENTITYSPORT_API_URL;

router.get('/seasons', async (req, res) => {
    try {
        const token = req.query.token;
        const response = await axios({
            method: "get",
            url: ENTITYSPORT_API_URL + 'seasons',
            params: {
              token: req.query.token,
            },
          });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Entitysport API' });
    }
});

module.exports = router;
