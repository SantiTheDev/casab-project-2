const mongoose = require('mongoose')

const codeSchema = mongoose.Schema({
    code: {
        type: String,
        require: true,
        maxLength: 6,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    timeActivation: {
        type: Date,
        default: Date.now(),
        expire: '3m'
    },
    timeExpiration: {
        type: Date,
        require: true,
        default: Date.now() + 120000 * 1.0
    },
    ip_address: {
        type: String,
        require: true,
        maxLength: 20
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }

})


module.exports = mongoose.model('Codes', codeSchema)