var mongoose    = require('mongoose');
var config = require('../config'); // get our config file
var Post   = require('../models/post'); // get our mongoose model

exports.getPost = function(req, res) {
    Post.find({}, function(err, posts) {
        if(err) throw err;
        res.json(posts);
    });
}; 
exports.getPostByID = function(pid,callback){
    Post.find({id:pid},callback);
};
exports.getPostbyUserID = function(id,req, res) {
    Post.find({userId:id}, function(err, posts) {
        if(err) throw err;
        res.json(posts)
    });
}; 