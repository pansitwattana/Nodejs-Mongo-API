var mongoose    = require('mongoose');
var config = require('../config'); // get our config file
var User   = require('../models/user'); // get our mongoose model
/*
exports.getUsers = function(req, res) {
    User.find({}, function(err, users) {
        if(err) throw err;
        res.json(users);
    });

}; */

exports.getUsers = function(callback,limit){
    User.find(callback).limit(limit);
};

exports.getUserByID = function(uid,callback){
    User.find({id:uid},callback);
};

exports.login = function(username,password,callback){
    User.find({email: username},callback);
};

exports.delete = function(uid,callback){
    console.log(uid)
    User.remove({id:uid},callback);
};

exports.add = function(user,callback){
    User.find({}, function(error, data){
       var id = Object.keys(data).length + 1;
       // create a sample user
       var newuser = new User({ 
       name: user.name,
       email: user.email,
       age: user.age,
       admin: 'false',
       id:id
        });
       console.log(newuser)
       // save the sample user
       newuser.save(callback)  
    });
};

exports.updateuser = function(uid,user,callback){
    User.update({id:uid},user,callback);
};