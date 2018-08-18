const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./_config/keys').mongoURI; 
const UserController = require('./_api/user/Control');
const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('Mongo connected'))
	.catch(err => console.log(err));

app.use('/users', UserController);
	
app.listen(port, () => console.log(`Server running on localhost:${port}`));
	