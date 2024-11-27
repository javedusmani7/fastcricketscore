const mongoose = require('mongoose');

const AninscoreSchema = new mongoose.Schema({
  eventId: { type: String,  unique: true },
  scoreId: { type: String },
  sportId: { type: Number },
});

module.exports = mongoose.model('Aninscore', AninscoreSchema);