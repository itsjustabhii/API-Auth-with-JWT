const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({        //Creating User Schema object
    name: {
        type: String,
        required: true,
        min: 6,
        max:255
    },
    email: {
        type: String,
        required:true,
        max:255,
        min:6
    },
    password: {
        type:String,
        reuired: true,
        max: 1024,
        min: 6
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)     //exporting our model