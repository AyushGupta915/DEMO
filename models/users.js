const mongoose = require('mongoose');
const ROLES_LIST = require('../config/roles_list'); 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    refreshToken: String,
    roles: {
        type: Map,
        of: Number,
        default: { User: 2001 } 
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
