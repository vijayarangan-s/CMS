const {Schema, model} = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    firstName : {
        type: String,
        required: true,
        maxlength: 100,
        default: null
    },
    lastName : {
        type: String,
        required: true,
        maxlength: 100,
        default: null
    },
    email : {
        type: String,
        required: true,
        unique: true,
        sparse:true,
        index:true,
        trim:true,
        default: null
    },
    password: {
        type: String,
        minlength: 8
    },
    phone: {
        type: String,
        default: null,
        maxlength:10
    },
    token: {
        type:String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    }
},{timestamps: true})

// plugin for passport-local-mongoose
// userSchema.plugin(passportLocalMongoose);

module.exports = model('user', userSchema) 