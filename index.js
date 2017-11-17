// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var path        = require('path');
var cookieParser = require('cookie-parser')
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
//var User   = require('./models/user'); // get our mongoose model
var Users = require('./controller/userController')
var Posts = require('./controller/postController')
var apiRoutes = express.Router();

app.use(cookieParser())
// =======================
// configuration =========
// =======================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var port = config.port; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
    //res.send('Hello! The API is at http://localhost:' + port + '/api');
    Users.getUsers(function(err,users){
        if(err) throw err;
        res.render('home',{
            title: "Customer list",
            users : users
        });
    });
});

app.get('/login',function(req,res){
    res.render('login')
});

apiRoutes.post('/login',function(req,res){
    var uname = req.body.username;
    var passwd = req.body.password;
    Users.login(uname,passwd,function(err,user){
        if(err) throw err;
        if(user && user.length!= 0){
            const payload = {
                id: user.id,
                email: user.email,
                admin: user.admin
            };
            var token = jwt.sign(payload,config.secret,{
                expiresIn:86400
            });
            return res.json({
                success: true,
                message: 'User found!',
                token : token
            })
        }
        else{
            
            return res.json({
                success: false,
                message: 'User not found!'
            });
        }
    });
});
apiRoutes.use(function(req,res,next){
    //var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    // decode token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
            }
		});

	} else {
		// if there is no token
        // return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});	
}    

});

app.get('/user',function(req,res){
    //res.send('api/users endpoint');
    //Users.getUsers(req,res);
    Users.getUsers(function(err,users){
        if(err) throw err;
        if(!err){
            res.render('userlist',{
                title: "Customer list",
                users : users
            });
        }
        else{
            return res.json({
                success: false,
                message: 'Can not get User'
            });
        }
    });
});
app.get('/user/:id',function(req,res){
    //res.send('api/users'+req.params.id);
    var id = req.params.id;
    Users.getUserByID(id,function(err,user){
        console.log(id);
        if(err) throw err;
        if(!err){
            return res.json({
                success: true,
                message: user
            });
        }
        else{
            return res.json({
                success: false,
                message: 'User can not delete'
            });
        }
    });
});
app.post('/user/delete',function(req,res){
    //res.send('api/users'+req.params.id);
    var id = req.body.id;
    Users.delete(id,function(err){
        if(err) throw err;
        if(!err){
            return res.json({
                success: true,
                message: 'Delete success'
            });
        }
        else{
            return res.json({
                success: false,
                message: 'User can not delete'
            });
        }
    });
});
app.delete('/user/:id',function(req,res){
    //res.send('api/users'+req.params.id);
    var id = req.params.id;
    Users.delete(id,function(err){
        if(err) throw err;
        if(!err){
            return res.json({
                success: true,
                message: 'Delete success'
            });
        }
        else{
            return res.json({
                success: false,
                message: 'User can not delete'
            });
        }
    });
});
app.put('/user/:id',function(req,res){
    //res.send('api/users'+req.params.id);
    var id = req.body.id;
    var user = {
        name: req.body.name,
        age: parseInt(req.body.age),
        email : req.body.email
    }
    console.log(user)
    Users.updateuser(id,user,function(err){
        if(err) throw err;
        if(!err){
            return res.json({
                success: true,
                message: 'Update Success'
            });
        }
        else{
            return res.json({
                success: false,
                message: 'Can not Update!'
            });
        }
    });
});

apiRoutes.post('/user/add',function(req,res){
    newuser = {
     name : req.body.name,
     age : req.body.age,
     email : req.body.email,
    }
    console.log(newuser)
    Users.add(newuser,function(err){
        if(err) throw err;
        if(!err){
            return res.json({
                success: false,
                message: 'Add success'
            });
        }
        else{
            return res.json({
                success: false,
                message: 'Can not Add!'
            });
        }
    });
});

app.get('/api/posts',function(req,res){
    //res.send('api/posts endpoint');
    Posts.getPost(req,res);
});

app.get('/api/users/oid/:oid',function(req,res){
    res.send('api/users/oid '+req.params.oid);
});

app.get('/api/posts/:id',function(req,res){
    //res.send('api/posts '+req.params.id);
    var id = req.params.id;
    Posts.getPostByID(id,function(err,post){
        if(err) throw err;
        res.json(post);
    });
});
app.get('/api/posts/userid/:uid',function(req,res){
    var id = req.params.uid;
    Posts.getPostbyUserID(id,req,res);
});


// API ROUTES -------------------
// we'll get to these in a second
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);