const mongoose = require('mongoose');


const CompetetionSchema = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    cid: { type: String,  unique : true},
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
    tej_cid : { type: Number,  unique : true}, // our custom unique ID
    tej_active : { type: Boolean, default: true}, // our custom active/inactive status
    sportsid: { type: String, default: null },  //
    btid: { type: String, default: null },    // betfair id
    fs1id: { type: String, default: null }, // fast_score1_id
    fs2id: { type: String, default: null }, // fast_score2_id
    fs3id: { type: String, default: null }, // fast_score3_id
    etid: { type: String, default: null }, // espn_id
    ttid: { type: String, default: null }, 
    srid: { type: String, default: null }, // sports_radar_competition_id
    us1id: { type: String, default: null },  // unknown_source1_competition_id
    us2id: { type: String, default: null }, // unknown_source2_competition_id
    us3id: { type: String, default: null }, // unknown_source3_competition_id
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('Competetion', CompetetionSchema);