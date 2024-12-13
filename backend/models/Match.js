const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
    competetion: { type: mongoose.Schema.Types.ObjectId, ref: 'Competetion', required: true},
    cid: { type: String},
    match_id: { type: Number,  unique: true },
    tej_match_id : { type: String},                                      // our custom unique ID
    tej_active : { type: Boolean, default: true},                        // our custom active/inactive status
    sports_match_id: { type: String, default: null },
    bt_match_id: { type: String, default: null },                        // betfair id
    fs1_match_id: { type: String, default: null },                       // fast_score1 id
    fs2_match_id: { type: String, default: null },                       // fast_score2 id
    fs3_match_id: { type: String, default: null },                       // fast_score3 id
    espn_match_id: { type: String, default: null },                      // espn id
    et_match_id: { type: String, default: null }, 
    tt_match_id: { type: String, default: null }, 
    sr_match_id: { type: String, default: null },                        // sports_radar_competition_id
    us1_match_id: { type: String, default: null },                       // unknown_source1_competition_id
    us2_match_id: { type: String, default: null },                       // unknown_source2_competition_id
    us3_match_id: { type: String, default: null },                       // unknown_source3_competition_id
    title: { type: String },
    short_title: { type: String },
    subtitle: { type: String },
    match_number: { type: String },
    format: { type: Number },
    format_str: { type: String },
    status: { type: Number },
    status_str: { type: String },
    status_note: { type: String },
    verified: { type: String },
    pre_squad: { type: String },
    odds_available: { type: String },
    game_state: { type: Number },
    game_state_str: { type: String },
    domestic: { type: String },
    competition: {
      cid: { type: String},
      title: { type: String },
      abbr: { type: String },
      type: { type: String },
      category: { type: String },
      match_format: { type: String },
      season: { type: String },
      status: { type: String },
      datestart: { type: String },
      dateend: { type: String },
      country: { type: String },
      total_matches: { type: String },
      total_rounds: { type: String },
      total_teams: { type: String },
    },
    teama: {
      team_id: { type: Number },
      name: { type: String },
      short_name: { type: String },
      logo_url: { type: String },
      thumb_url: { type: String },
      scores_full: { type: String },
      scores: { type: String },
      overs: { type: String },
    },
    teamb: {
      team_id: { type: Number },
      name: { type: String },
      short_name: { type: String },
      logo_url: { type: String },
      thumb_url: { type: String },
      scores_full: { type: String },
      scores: { type: String },
      overs: { type: String },
    },
    date_start: { type: String },
    date_end: { type: String },
    timestamp_start: { type: Number },
    timestamp_end: { type: Number },
    date_start_ist: { type: String },
    date_end_ist: { type: String },
    venue: {
      venue_id: { type: String },
      name: { type: String },
      location: { type: String },
      country: { type: String },
      timezone: { type: String },
    },
    umpires: { type: String },
    referee: { type: String },
    equation: { type: String },
    live: { type: String },
    result: { type: String },
    result_type: { type: Number },
    win_margin: { type: String },
    winning_team_id: { type: Number },
    commentary: { type: Number },
    wagon: { type: Number },
    latest_inning_number: { type: Number },
    presquad_time: { type: String },
    verify_time: { type: String },
    match_dls_affected: { type: String },
    weather: {type : []},
    pitch: {
      pitch_condition: { type: String },
      batting_condition: { type: String },
      pace_bowling_condition: { type: String },
      spine_bowling_condition: { type: String },
    },
    toss: {
      text: { type: String },
      winner: { type: Number },
      decision: { type: Number },
    },
  });

module.exports = mongoose.model('Match', MatchSchema);