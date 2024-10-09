const mongoose = require('mongoose');

const CompetetionSchema = new mongoose.Schema({
    sport_id: { type: String },
    source_id: { type: String },
    cid: { type: String },
    title: { type: String },
    abbr: { type: String },
    type: { type: String },
    category: { type: String },
    match_format: { type: String },
    status: { type: String },
    season: { type: String },
    datestart: { type: String },
    dateend: { type: String },
    country: { type: String },
    total_matches: { type: String },
    total_rounds: { type: String },
    total_teams: { type: String },
    matches_url: { type: String },
    teams_url: { type: String },
    standings_url: { type: String },
    status: { type: Boolean, default: true },
    create_date: { type: Date},
    update_date: { type: Date},
});

module.exports = mongoose.model('Competetion', CompetetionSchema);