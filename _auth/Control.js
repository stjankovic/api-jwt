const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const User = require('../_api/user/User');
const config = require('../_config/keys'); 
const verifyToken = require('./Verify');

//Create one user and add a token for 24h//
//REGISTER//
router.post('/register', function (req, res) {

	let hashedPassword = bcrypt.hashSync(req.body.password, 8);

	User.create({
		username: req.body.username,
		password: hashedPassword
	},
	function (err, user) {
    if (err) return res.status(500).send(`Can't register user`)

    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // 24h
    });
		res.status(200).send({ auth: true, token: token });
		console.log('Request to /register/ POST')
  }); 
});

//Get current user//
router.get('/me', verifyToken, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send(`Server problem`);
    if (!user) return res.status(404).send(`!user`);
    
    res.status(200).send(user);
  });
});


//LOGIN//
router.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send(`Server problem`);
    if (!user) return res.status(404).send(`!user`);
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
		res.status(200).send({ auth: true, token: token });
		console.log('Request to /login/ POST')
  });
});

//LOGOUT//
router.get('/logout', function(req, res) {
	res.status(200).send({ auth: false, token: null });
	console.log('Request to /logout/ GET')
});



module.exports = router;
