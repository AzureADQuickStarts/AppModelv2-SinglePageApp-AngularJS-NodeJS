// Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid');
var config = require('./config');
var passport = require('passport');
var OIDCBearerStrategy = require('passport-azure-ad').BearerStrategy;

// POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authentication
var options = {
    identityMetadata: config.creds.identityMetadata,
    audience: config.creds.audience,
	validateIssuer: false,
};
app.use(passport.initialize());
passport.use(new OIDCBearerStrategy(options, function (token, done) {
	return done(null, token, null);
}));

// In-Memory Data Storage
var tasks = [];

// Routes
var router = express.Router();
router.route('/api/tasks')
	.post(passport.authenticate('oauth-bearer', { session: false }), function(req, res) {
		if (!req.body.Description) {
			res.status(400).send('Please provide a task description');
			return;
		}
		var task = {
			"ID": uuid.v4(),
			"Description": req.body.Description,
			"Owner": req.user.sub,
		};
		tasks.push(task);
		console.log('Task ' + task.ID + ' created.');
		res.json(task);
	})
	.get(passport.authenticate('oauth-bearer', { session: false }), function (req, res) {
		res.json(tasks.filter(function (task) {
			return task.Owner == req.user.sub;
		}));
	});

router.route('/api/tasks/:task_id')
	.get(passport.authenticate('oauth-bearer', { session: false }), function(req, res) {
		var task = tasks.find(function (task) {
			return task.ID == req.params.task_id;
		});
		if (typeof(task) === 'undefined') {
			res.status(404).send('Can\'t find that task...');
		} else if (task.Owner != req.user.sub) {
			res.status(403).send('Forbidden...');
		} else {
			res.json(task);
		}
	})
	.put(passport.authenticate('oauth-bearer', { session: false }), function(req, res) {
		if (!req.body.Description) {
			res.status(400).send('Please provide a task description');
			return;
		}

		var task = tasks.find(function (task) {
			return task.ID == req.params.task_id; 
		});
		
		if (typeof(task) === 'undefined') {
			res.status(404).send('Can\'t find that task...');
		} else if (task.Owner != req.user.sub) {
			res.status(403).send('Forbidden...');
		} else {
			task.Description = req.body.Description;
			console.log('Task ' + task.ID + ' updated.');
			res.json(task);
		}
	})
	.delete(passport.authenticate('oauth-bearer', { session: false }), function (req, res) {
		var task = tasks.find(function (task) {
			return task.ID == req.params.task_id; 
		});
		
		if (typeof(task) === 'undefined') {
			res.status(404).send('Can\'t find that task...');
		} else if (task.Owner != req.user.sub) {
			console.log(req.user.sub);
			console.log(task.Owner);
			res.status(403).send('Forbidden...');
		} else {
			tasks = tasks.filter(function (task) {
				return task.ID != req.params.task_id;	
			});
			console.log('Task ' + task.ID + ' deleted.');
			res.status(200).send();
		}
	});

router.route('/').get(function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

app.use(router);
app.use('/static', express.static('app'));
app.use(function(req, res, next) {
  res.status(404).send('Nothing at this URL...');
});


// Start Server
var port = process.env.port || 8080;
var server = app.listen(port);
console.log('To Do List sample app listening at on port', port);

// https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=67227e4e-f48b-4f6b-9721-d4cc283d32e9&response_type=id_token&response_mode=fragment&scope=openid&nonce=12345678