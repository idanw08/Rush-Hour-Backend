const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const rushHourDB = require('./RushhourDB');
const createError = require('http-errors'); // Create HTTP errors for Express with ease.
const path = require('path'); // provides a way of working with directories and file paths.
const logger = require('morgan'); // used for logging request details
const { check, validationResult } = require('express-validator');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();
const port = 3000;

app.use(cors())
app.use(logger('dev'));
app.use(bodyparser.json()); // to support JSON-encoded bodies~
app.use(express.static(path.join(__dirname, 'public'))); // to serve static files of the application
app.use(bodyparser.urlencoded({
	extended: true
}));
module.exports = app;

let verifyPlayerObject = [
	check(['WorkerID', 'Age', 'Gender', 'Education'], 'Not Exist').exists(),
	check('Age', 'Age should be 18-120.').isInt({
		min: 18,
		max: 120
	}),
	check('Gender', 'Invalid Gender').isIn(['Female', 'Male']),
	check('Education', 'Invalid Education.').isIn(['Less than High School', 'High School/GED', 'College', 'Graduate Degree'])
];

let verifyInstanceObject = [
	check(['WorkerID', 'InstanceIndex', 'Log', 'QnsAns'], 'Not Exist').exists(),
	check('InstanceIndex').isInt({
		min: 1,
		max: 3
	})
];

const verifyValidatinObjects = [
	check(['WorkerID', 'Code'], 'Not Exist').exists()
];

// TODO: remove this hello world after develop!
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

rushHourDB.CreateTables();

app.get('/players', async (req, res) => {
	try {
		const result = await rushHourDB.getPlayers();
		res.send(result.Items)
	} 
	catch (error) {
		res.send(error)
	}
})
 
// http://localhost:3000/players
app.post('/players', verifyPlayerObject, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	try {
		const result = await rushHourDB.InsertPlayer(req.body);
		console.log(`New player inserted. Validation code: `, result);
		res.status(201).json({
			ValidationCode: result
		});
	} 
	catch (error) {
		console.log('Error - New player not inserted to DB.', error);
		if (error.message === 'The conditional request failed') {
			res.status(error.statusCode).send(`Player not created - WorkerID already exist. ${error.message}`);
		} else {
			res.status(error.statusCode).send(error.message);
		}
	}
});

// http://localhost:3000/players 
// TODO: add validation for question
app.post('/player/instance_data', verifyInstanceObject, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	try {
		const result = await rushHourDB.InsertInstanceData(req.body);	
		console.log(`Instance data inserted.`, result);
		res.sendStatus(201);
	} 
	catch (error) {
		console.log(error);
		res.status(error.statusCode).send(error.message);
	}
});

app.get('/Questions', (req, res) => {
	rushHourDB.GetQuestions()
		.then((result) => {
			let ans = new Array();
			result.Items.forEach(elem => {
				ans.push(elem.Question.S);
			});
			res.status(200).send(ans);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err);
		});
});

app.get('/player/instance_data', async (req, res) => {
	try {
		var result = await rushHourDB.getInstanceData()
		res.send(result)
	} 
	catch (error) {
		console.log('error')
		res.send(error)
	}
});

app.get('/Validation', async (req, res) => {
	if(req.query.WorkerID == '' || req.query.WorkerID == undefined){
		res.json({ code: 'WorkerID Not Found' })
		//res.send('WorkerID Not Found')
		return
	}
	try {
		const validationCode = await rushHourDB.GetValidationCode(req.query.WorkerID)
		res.json({ code: validationCode })
		//res.send(validationCode)
	} 
	catch (err) {
		res.json({ error: err })
	}
})
