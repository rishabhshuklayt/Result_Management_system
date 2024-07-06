const { TokenExpiredError } = require('jsonwebtoken');
const mongoose = require('mongoose')

const oneTimePassword = new mongoose.Schema({
    otp:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' } // TTL index to expire documents after 5 minutes
      }
})

module.exports = mongoose.model('otp', oneTimePassword);