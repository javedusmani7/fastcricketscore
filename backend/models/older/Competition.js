const mongoose = require('mongoose');

// Create a connection object to Database 2
const OLDER_MONGODB_URI = process.env.OLDER_MONGODB_URI;
const db2 = mongoose.createConnection(OLDER_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const CompetitionSchema = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    cid: { type: String  ,  unique : true , default: null},
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
    rounds: { type : Array , "default" : [] },
    isActive: { type: Boolean, default: true },
    } , {
    timestamps: true
  });


// Connect to Database 2 for Competition model
module.exports = db2.model('Competition', CompetitionSchema, 'competitions');