const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: true },
    create_date: { type: Date},
    update_date: { type: Date},
});

module.exports = mongoose.model('Sport', SportSchema);