const express = require('express');
const { getSeasons } = require('../controllers/api.controller');
const router = express.Router();


router.get('/seasons', getSeasons);

// router.get('/seasons', async (req, res) => {
//     try {
//         const token = req.query.token;
//         const response = await axios({
//             method: "get",
//             url: ENTITYSPORT_API_URL + 'seasons',
//             params: {
//               token: req.query.token,
//             },
//           });
//         res.json(response.data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching data from Entitysport API' });
//     }
// });

module.exports = router;
