const mongoose = require('mongoose');

const MatchFantasy = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
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
    latest_inning_Number: { type: Number },
    presquad_time: { type: String },
    verify_time: { type: String },
    match_dls_affected: { type: String },
    live_inning_Number: { type: Number },
    day: { type: String },
    session: { type: String },
    weather: {
      weather: { type: String },
      weather_desc: { type: String },
      temp: { type: Number },
      humidity: { type: Number },
      visibility: { type: Number },
      wind_speed: { type: String },
      clouds: { type: Number },
    },
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
    points: {
      teama: {
        playing11: {type : [{
          pid: { type: String },
          name: { type: String },
          role: { type: String },
          rating: { type: String },
          point: { type: String },
          starting11: { type: String },
          run: { type: String },
          four: { type: String },
          six: { type: String },
          sr: { type: String },
          fifty: { type: String },
          duck: { type: String },
          wkts: { type: String },
          maidenover: { type: String },
          er: { type: String },
          catch: { type: String },
          runoutstumping: { type: String },
          runoutthrower: { type: String },
          runoutcatcher: { type: String },
          directrunout: { type: String },
          stumping: { type: String },
          thirty: { type: String },
          bonus: { type: String },
          bonuscatch: { type: String },
          bonusbowedlbw: { type: String },
        }]},
        substitute: {type : [{
          pid: { type: String },
          name: { type: String },
          role: { type: String },
          rating: { type: String },
          point: { type: String },
          starting11: { type: String },
          run: { type: String },
          four: { type: String },
          six: { type: String },
          sr: { type: String },
          fifty: { type: String },
          duck: { type: String },
          wkts: { type: String },
          maidenover: { type: String },
          er: { type: String },
          catch: { type: String },
          runoutstumping: { type: String },
          runoutthrower: { type: String },
          runoutcatcher: { type: String },
          directrunout: { type: String },
          stumping: { type: String },
          thirty: { type: String },
          bonus: { type: String },
          bonuscatch: { type: String },
          bonusbowedlbw: { type: String },
        }]},
      },
      teamb: {
        playing11: {type : [{
          pid: { type: String },
          name: { type: String },
          role: { type: String },
          rating: { type: String },
          point: { type: String },
          starting11: { type: String },
          run: { type: String },
          four: { type: String },
          six: { type: String },
          sr: { type: String },
          fifty: { type: String },
          duck: { type: String },
          wkts: { type: String },
          maidenover: { type: String },
          er: { type: String },
          catch: { type: String },
          runoutstumping: { type: String },
          runoutthrower: { type: String },
          runoutcatcher: { type: String },
          directrunout: { type: String },
          stumping: { type: String },
          thirty: { type: String },
          bonus: { type: String },
          bonuscatch: { type: String },
          bonusbowedlbw: { type: String },
        }]},
        substitute: {type : [{
          pid: { type: String },
          name: { type: String },
          role: { type: String },
          rating: { type: String },
          point: { type: String },
          starting11: { type: String },
          run: { type: String },
          four: { type: String },
          six: { type: String },
          sr: { type: String },
          fifty: { type: String },
          duck: { type: String },
          wkts: { type: String },
          maidenover: { type: String },
          er: { type: String },
          catch: { type: String },
          runoutstumping: { type: String },
          runoutthrower: { type: String },
          runoutcatcher: { type: String },
          directrunout: { type: String },
          stumping: { type: String },
          thirty: { type: String },
          bonus: { type: String },
          bonuscatch: { type: String },
          bonusbowedlbw: { type: String },
        }]},
      },
    },
  });

module.exports = mongoose.model('MatchFantasy', MatchFantasy);