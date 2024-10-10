const mongoose = require('mongoose');

const CompetetionSchema = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    cid: { type: String  ,  unique : true},
    title: { type: String },
    abbr: { type: String },
    category: { type: String },
    game_format: { type: String },
    status: { type: String },
    season: { type: String },
    datestart: { type: String },
    dateend: { type: String },
    country: { type: String },
    total_matches: { type: String },
    total_rounds: { type: String },
    total_teams: { type: String },
    isActive: { type: Boolean, default: true },
    } , {
    timestamps: true
  });

module.exports = mongoose.model('Competetion', CompetetionSchema);