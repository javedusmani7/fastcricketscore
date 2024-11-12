const mongoose = require('mongoose');


const Competetion_Matches_Mapping = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    cid: { type: String  ,  unique : true},
    // match_id: { type: Number},
    datestart: { type: String },
    dateend: { type: String },
    status: { type: String },
    fantasy_status: {type: Boolean, default: true },
    live_status: { type: Boolean, default: true},
    scorecard_status: {type: Boolean, default: true },
    squad_status: {type: Boolean, default: true},
    active: { type: Boolean, default: true},
    },{
    timestamps: true
  });

module.exports = mongoose.model('Competetion_Matches_Mapping', Competetion_Matches_Mapping);