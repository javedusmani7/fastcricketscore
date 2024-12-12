const mongoose = require('mongoose');

const IntervalSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true},
    time: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    api_url: { type: String, default: null },
    status: { type: Boolean, default: true },
},
{
    timestamps: true
});

module.exports = mongoose.model('Interval', IntervalSchema);