const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    team_id: { type: Number,  unique: true },
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
    tid: { type: Number },
    title: { type: String },
    abbr: { type: String },
    alt_name: { type: String },
    type: { type: String },
    thumb_url: { type: String },
    logo_url: { type: String },
    country: { type: String },
    sex: { type: String },
});

module.exports = mongoose.model('Team', TeamSchema);