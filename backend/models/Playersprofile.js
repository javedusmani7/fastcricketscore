const mongoose = require('mongoose');

const Playersprofile = new mongoose.Schema({
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    pid: { type: Number,  unique: true},
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
});

module.exports = mongoose.model('Playersprofile', Playersprofile);