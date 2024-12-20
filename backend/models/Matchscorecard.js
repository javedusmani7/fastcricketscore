const mongoose = require('mongoose');

const Matchscorecard = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    // cid: { type: mongoose.Schema.Types.ObjectId, ref: 'Competetion', default: null },
    cid: { type: String},
    tej_match_id : { type: String},
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    match_id: { type: Number,  unique: true },
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
    competition: {
      cid: { type: Number },
      title:  { type: String },
      abbr:  { type: String },
      type:  { type: String },
      category:  { type: String },
      match_format:  { type: String },
      season:  { type: String },
      status:  { type: String },
      datestart:  { type: String },
      dateend:  { type: String },
      country:  { type: String },
      total_matches:  { type: String },
      total_rounds:  { type: String },
      total_teams:  { type: String },
    },
    domestic: { type: String },
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
    current_over: { type: String },
    previous_over: { type: String },
    man_of_the_match: {
      pid: { type: Number },
      name: { type: String },
      thumb_url: { type: String },
    },
    man_of_the_series: { type: String },
    is_followon: { type: Boolean, default: 0 },
    team_batting_first: { type: String },
    team_batting_second: { type: String },
    last_five_overs: { type: String },
    innings: {type : []},
    players: {type : []},
    pre_match_odds: {type : []},
    day_remaining_over: { type: String },
    match_notes: {type : []},
  });

module.exports = mongoose.model('Matchscorecard', Matchscorecard);