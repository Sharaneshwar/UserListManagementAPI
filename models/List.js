const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    properties: [{
        title: { type: String, required: true },
        fallback: { type: String, required: true }
    }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('List', listSchema);
