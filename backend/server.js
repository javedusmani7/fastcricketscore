const express = require('express');
const mongoose = require('mongoose');
const Sport = require('../backend/models/Sport');
const Source = require('../backend/models/Source');
const Season = require('../backend/models/Season');
const Competetion = require('../backend/models/Competetion');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();
// mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// // Define a simple model
// const Item = mongoose.model('Item', new mongoose.Schema({
//   name: String
// }));

// // API routes
// app.get('/api/items', async (req, res) => {
//   const items = await Item.find();
//   res.send(items);
// });

// app.post('/api/items', async (req, res) => {
//   const newItem = new Item(req.body);
//   await newItem.save();
//   res.status(201).send(newItem);
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
