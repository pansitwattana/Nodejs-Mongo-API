// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 
    id:{
        type:Number,
        require: true,
        unique:true
    },
    name: {
        type:String,
        require: true,
        trim : true
    }, 
    age:{
        type:Number,
        min:13,
        max:99
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    },
    salt: String,
    hashpassword: String, 
    admin: Boolean ,
    created:{
        type:Date,
        default:Date.now
    }
}));