// Load Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid');
var config = require('./config');
var passport = require('passport');

// Configure requests parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Pull in the Azure AD bearer passport strategy
var passport = require('passport');
var OIDCBearerStrategy = require('passport-azure-ad').BearerStrategy;

// This object is used for in-memory data storage, instead of a database.
// Each time you run the server, you will get a fresh, empty list.
var tasks = [];

// Load passport and configure it to use Azure AD Bearer auth
app.use(passport.initialize());
passport.use(new OIDCBearerStrategy({
    "identityMetadata": config.creds.identityMetadata,
    "audience": config.creds.audience,
	"validateIssuer": false,
}, function (token, done) {
	return done(null, token, null);
}));

// Set up API Routes, using Azure AD bearer auth
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
			
			// Access user info in the token via passport's user object
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

// Serve the single page in our SPA
router.route('/').get(function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

// Use the API routes from above, & use /static for serving html & js
app.use(router);
app.use('/static', express.static('app'));
app.use(function(req, res, next) {
  res.status(404).send('Nothing at this URL...');
});


// Start Server
var port = process.env.port || 8080;
var server = app.listen(port);
console.log('To Do List sample app listening at on port', port);