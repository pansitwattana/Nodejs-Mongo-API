// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Post', new Schema({ 
    id:{
        type:Number,
        require: true,
        unique:true
    },
    userId:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    body: {
        type:String,
        require:true,
    },
    created:{
        type:Date,
        default:Date.now
    }
}));