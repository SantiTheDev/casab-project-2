const mongoose =  require('mongoose')

const roleSchema = mongoose.Schema({
    role: {
        type: String,
        require: true,
        trim: true
    }
}, {timestamp: true})


module.exports = mongoose.model('Roles', roleSchema)