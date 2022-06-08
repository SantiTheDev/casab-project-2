const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    last_name:{
        type: String,
        required: true,
        
    },
    phone: {
        type: Number,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username:{
        type: String,
        require: true,
        min: 6,
        max: 50,
        unique: true
    },
    last_accesed_ip: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: mongoose.Schema.ObjectId,
        ref: 'Roles',
        default: "62a04808e0243580be4f040c",
    },
    isActive: {
        type: Boolean,
        default: false
    },
    last_sessions: {
        type: Date,
        
    }
})

module.exports = mongoose.model('User', userSchema);