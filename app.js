const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const rushHourDB = require('./RushhourDB');
const createError = require('http-errors'); // Create HTTP errors for Express with ease.
const path = require('path'); // provides a way of working with directories and file paths.
const logger = require('morgan'); // used for logging request details
const { check, validationResult } = require('express-validator');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const app = express();
const port = 8081;

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
		'script-src': [SELF, INLINE, "'unsafe-eval'"],
        'style-src': [SELF, INLINE, 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
		'font-src': [SELF, 'data:', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        'img-src': [SELF, 'data:'],
        'worker-src': [NONE],
        'block-all-mixed-content': true
    }
}));
app.use(cors())
app.use(logger('dev'));
app.use(bodyparser.json()); // to support JSON-encoded bodies~
app.use(express.static(path.join(__dirname, 'dist/rushHourWebsite')));
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

const verifyPlayerParameterUpdate = [
	check(['Parameter', 'Data'], 'Not Exist').exists(),
	check('Parameter', 'Invalid Parameter').isIn(['Bonus', 'Familiarity'])
];

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
app.post('/player/instance_data', verifyInstanceObject, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	try {
		await rushHourDB.InsertInstanceData(req.body);	
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
});

app.put('/player/:WorkerID', verifyPlayerParameterUpdate, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}

	try {
		await rushHourDB.updatePlayerValue(req.params.WorkerID, req.body.Parameter, req.body.Data);
		res.sendStatus(200);
	} 
	catch (err) {
		console.log(err)
		res.json({ error: err })
	}
});

app.get('/', (req,res) => {
	console.log('index.html request')
	res.sendFile(path.join(__dirname, '/Client/dist/rushHourWebsite/index.html'));
});

app.listen(port, () => console.log(`Rush Hour server listening on port ${port}!`))