const mongoose = require('mongoose');


const Competetion_Standing = new mongoose.Schema({
  sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
  source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
  competetion: { type: mongoose.Schema.Types.ObjectId, ref: 'Competetion' },
  cid: { type: String,  unique : true, default: null},
  standing_type: { type: String },
  standings: {type : [{
    round: {
      rid: { type: Number },
      order: { type: Number },
      name: { type: String },
      type: { type: String },
      match_format: { type: String },
      datestart: { type: String },
      dateend: { type: String },
    },
    standings: {type : [{
      team_id: { type: String },
      played: { type: String },
      win: { type: String },
      loss: { type: String },
      draw: { type: String },
      nr: { type: String },
      overfor: { type: String },
      runfor: { type: String },
      overagainst: { type: String },
      runagainst: { type: String },
      netrr: { type: String },
      points: { type: String },
      lastfivematch: { type: String },
      lastfivematchresult: { type: String },
      quality: { type: String },
      team: {
        tid: { type: Number },
        title: { type: String },
        abbr: { type: String },
        alt_name: { type: String },
        type: { type: String },
        thumb_url: { type: String },
        logo_url: { type: String },
        country: { type: String },
        sex: { type: String },
      },
    }]},
  }]},
});

module.exports = mongoose.model('Competetion_Standing', Competetion_Standing);