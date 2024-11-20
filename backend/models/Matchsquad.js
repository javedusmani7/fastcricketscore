const mongoose = require('mongoose');

const Matchsquad = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    tej_match_id : { type: String},
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    match_id: { type: Number,  unique: true },
    teama: {
      team_id: { type: Number },
      squads:  {type : [{
        player_id: { type: String },
        substitute: { type: String },
        out: { type: String },
        in: { type: String },
        role_str: { type: String },
        role: { type: String },
        playing11: { type: String },
        name: { type: String },
        }]},
    },
    teamb: {
      team_id: { type: Number },
      squads:  {type : [{
        player_id: { type: String },
        substitute: { type: String },
        out: { type: String },
        in: { type: String },
        role_str: { type: String },
        role: { type: String },
        playing11: { type: String },
        name: { type: String },
        }]},
    },
    teams: {type : [{
      tid: { type: Number },
      title: { type: String },
      abbr: { type: String },
      alt_name: { type: String },
      type: { type: String },
      thumb_url: { type: String },
      logo_url: { type: String },
      country: { type: String },
      sex: { type: String },
      }]},
    players: {type : [{
      pid: { type: Number },
      title: { type: String },
      short_name: { type: String },
      first_name: { type: String },
      last_name: { type: String },
      middle_name: { type: String },
      birthdate: { type: String },
      birthplace: { type: String },
      country: { type: String },
      primary_team: {type : []},
      logo_url: { type: String },
      playing_role: { type: String },
      batting_style: { type: String },
      bowling_style: { type: String },
      fielding_position: { type: String },
      recent_match: { type: Number },
      recent_appearance: { type: Number },
      fantasy_player_rating: { type: Number },
      facebook_profile: { type: String },
      twitter_profile: { type: String },
      instagram_profile: { type: String },
      debut_data: { type: String },
      thumb_url: { type: String },
      nationality: { type: String }
    }]}
  });

module.exports = mongoose.model('Matchsquad', Matchsquad);