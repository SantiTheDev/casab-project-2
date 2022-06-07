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
        default: Date.now()
    },
    timeExpiration: {
        type: Date,
        require: true,
        default: Date.now() + 120000 * 1.0
    },
    tipo: {
        type: String,
        require: true,
        maxLength: 15
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }

})


module.exports = mongoose.model('Codes', codeSchema)