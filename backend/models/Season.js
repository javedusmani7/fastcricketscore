const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
    sid: { type: String, unique: true, required: true  },
    sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', default: null },
    source_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', default: null },
    name: { type: String, required: true },
    competitions_url: { type: String },
    status: { type: Boolean, default: true },
    create_date: { type: Date},
    update_date: { type: Date},
},{
    timestamp: true
}
);


module.exports = mongoose.model('Season', SeasonSchema);