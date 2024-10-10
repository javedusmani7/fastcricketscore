const express = require('express');
const mongoose = require('mongoose');
const Sport = require('../backend/models/Sport');
const Source = require('../backend/models/Source');
const Season = require('../backend/models/Season');
const Competetion = require('../backend/models/Competetion');
const connectDB = require('./config/db');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const syncRoutes = require('./routes/sync');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Use the verifyTokenMiddleware for all routes;
// which will check weather token query parameter is present or not
const verifyTokenMiddleware = require('./middleware/verifyTokenMiddleware');
app.use(verifyTokenMiddleware);

// MongoDB connection
connectDB();

// Routes
app.use('/sync', syncRoutes);
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
