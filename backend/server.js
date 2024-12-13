const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const syncRoutes = require('./routes/sync');
const adminRoutes = require('./routes/admin');
// const cronJobs = require('./cronJob');
// const cronJobs = require('./utils/cronJob'); // Import your cron jobs
const userRoutes =require('./routes/user');
// const cronJobs = require('./cronJob'); // Import your cron jobs

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Use the verifyTokenMiddleware for all routes;
// which will check weather token query parameter is present or not
const verifyTokenMiddleware = require('./middleware/verifyTokenMiddleware');
// app.use(verifyTokenMiddleware);

// MongoDB connection
connectDB();

// Routes
app.use('/sync',verifyTokenMiddleware, syncRoutes);
app.use('/api',verifyTokenMiddleware, apiRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
