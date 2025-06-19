const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'User'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    aadhar: {
        type: Number,
        required: true
    },
    pan: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    points : {
        type: Number,
        default: 0
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;