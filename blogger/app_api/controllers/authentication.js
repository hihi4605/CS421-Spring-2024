var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

// Register a new user
module.exports.register = function(req, res) {
	if(!req.body.name || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
// Create a new user
	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	user.setPassword(req.body.password);

    user.save().then(function() {
        var token = user.generateJwt();
        sendJSONresponse(res, 200, {
            "token": token
        });
    }).catch(function(err) {
        sendJSONresponse(res, 500, err);
    });
};

// Login a user
module.exports.login = function(req, res) {
	if(!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
// Passport authentication
	passport.authenticate('local', function(err, user, info){
		var token;

		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}

		if(user) {
			token = user.generateJwt();
			sendJSONresponse(res, 200, {
				"token": token
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
	})(req, res);
};