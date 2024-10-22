const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
    source_id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String},
    status: { type: Boolean, default: true },
}, {
    timestamps: true
  });

module.exports = mongoose.model('Source', SourceSchema);