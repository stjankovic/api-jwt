const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./User');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//Create a new user//
router.post('/', function (req, res) {
  User.create({
		username: req.body.username,
		password: req.body.password
	},
	function (err, user) {
		if (err) return res.status(500).send(`Can't connect to the database.`);
		res.status(200).send(user);
		console.log(`Request to /users/ POST`);
	});
});

//Get all users//
router.get('/', function (req, res) {
	User.find({}, function (err, users){
		if (err) return res.status(500).send(`Can't find users`);
		res.status(200).send(users);
		console.log(`Request to /users/ GET`);
	});
});

//Get a single user//
router.get('/:id', function (req, res) {
	User.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).send("Can't find user"); 
		if (!user) return res.status(404).send("That user doesn't exist");
		res.status(200).send(user);
		console.log(`Request to /users/${req.params.id} GET`);
	})
})

//Delete a single user//
router.delete('/:id', function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send(`Deletedomg user ${user.name}`);
		console.log(`Request to /users/${req.params.id} DELETE`);
	});
});

//Updates a signle user//
router.put('/:id', function (req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
			if (err) return res.status(500).send("Can't update the user");
			res.status(200).send(user);
			console.log(`Request to /users/${req.params.id} PUT`);
	});
});

module.exports = router;
