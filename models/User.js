const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    properties: { type: Map, of: String }
});

module.exports = mongoose.model('User', userSchema);
