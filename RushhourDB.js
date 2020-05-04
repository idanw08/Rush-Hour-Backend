let AWS = require('aws-sdk');
let util = require('util');
let uniqueString = require('unique-string');
let shortid = require('shortid');
// AWS.config.update({
// 	region: "us-west-2",
// 	endpoint: "http://localhost:8000"
// });
let dynamodb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
let docClient = new AWS.DynamoDB.DocumentClient( { apiVersion: '2012-08-10' } );
let converter = AWS.DynamoDB.Converter;
let questionsIDCounter = 0;

AWS.config.update({
	region: "us-west-2"
});

let createTableCallback = (err, data) => {
	if (err) {
		console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
	} else {
		console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
	}
};

/** 
 * Create all tables. One for players and a table for each game instance data of each player.
 * If tables exist, do nothing.
 */
let CreateTables = () => {
	dynamodb.listTables(function (err, data) {
		if (err) {
			console.error(`Fail to list tables. ${err}`);
			return;
		} else {
			console.log(`Tables Exist: ${data.TableNames}`);
			CreatePlayersTable(data);
			CreateScenariosDataTable(data);
			CreateQuestionsTable(data);
		}
		console.log(`All Tables Ready.`);
	});
};

let InsertPlayer = async (playerInfo) => {
	const validationCode = shortid.generate();
	const params = {
		TableName: 'Players',
		Item: {
			"WorkerID": playerInfo.WorkerID,
			"Age": parseInt(playerInfo.Age),
			"Gender": playerInfo.Gender,
			"Education": playerInfo.Education,
			"ValidationCode": validationCode,
			"Bonus": -1.00,
			"Familiarity": -1
		},
		ConditionExpression: 'attribute_not_exists(WorkerID)'
	}
	console.log(params);
	return new Promise((resolve, reject) => {
		docClient.put(params, (err, data) => {
			if (err) reject(err);
			else resolve(validationCode);
		})
	});
}

/** Insert log and answers of player in this instance. */
let InsertInstanceData = (instance_data) => {
	const params = {
		TableName: `Scenarios_Data`,
		Item: {
			WorkerID: instance_data.WorkerID,
			InstanceIndex: parseInt(instance_data.InstanceIndex),
			Log: instance_data.Log,
			QnsAns: instance_data.QnsAns
		},
		ConditionExpression: 'attribute_not_exists(WorkerID)'
	};

	return new Promise((resolve, reject) => {
		docClient.put(params, (err, data) => {
			if (err) reject(err);
			else {
				//console.log("Instance data inserted.", params);
				console.log("Instance data inserted.", util.inspect(params, {depth: null, colors: true}));
				resolve(data);
			}
		})
	});
}

let GetQuestions = () => {
	const params = { TableName: 'Questions' };
	return new Promise((resolve, reject) => {
		dynamodb.scan(params, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

let GetValidationCode = (WorkerID) => {
	const params = {
		TableName: 'Players',
		Key: { WorkerID: WorkerID }
	};

	return new Promise((resolve, reject) => {
		docClient.get(params, (err, data) => {
			if (err) { reject(err); }
			else 
			{
				if (isEmpty(data))
				{
					reject("WorkerID Not Found");
				}
				else 
				{
					resolve(data.Item.ValidationCode);
				}
			}
		})
	});
}

let getPlayers = () => {
	const params = { TableName: 'Players' };
	return new Promise((resolve, reject) => {
		dynamodb.scan(params, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

let getInstanceData = () => {
	const params = { TableName: 'Scenarios_Data' };
	return new Promise((resolve, reject) => {
		dynamodb.scan(params, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

let updatePlayerValue = function(workerID, parameter ,data) {
	// if (parameter === 'Bonus' && !isFloat(data)){
	// 	return Promise.reject(new Error('Bonus is not a float!'));
	// }
	// if (parameter === 'Familiarity' && (data >= 0 && data <= 5)){
	// 	return Promise.reject(new Error('Familiarity between 0-5'));
	// }
	const params = {
		TableName: 'Players',
		Key: { WorkerID: workerID },
		UpdateExpression: `set ${parameter} = :val`,
		ExpressionAttributeValues:{ ":val": data },
		ReturnValues:"UPDATED_NEW"
	};

	return new Promise((resolve, reject) => {
		docClient.update(params, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		})
	});
}

module.exports = {
	CreateTables,
	InsertPlayer,
	InsertInstanceData,
	GetQuestions,
	GetValidationCode,
	getPlayers,
	getInstanceData,
	updatePlayerValue
};

let isEmpty = (obj) => {
    for(var key in obj) {
        if (obj.hasOwnProperty(key))
		{
			return false;
		}
    }
    return true;
}

function CreateQuestionsTable(data) {
	if (data.TableNames.includes(`Questions`)) { return; }
	
	let params = {
		TableName: 'Questions',
		KeySchema: [
			{ AttributeName: "Question", KeyType: "HASH" },
		],
		AttributeDefinitions: [
			{ AttributeName: "Question", AttributeType: "S" }
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	};
	dynamodb.createTable(params, createTableCallback);
	console.log('Questions Table Created.');
}

function CreateScenariosDataTable(data) {
	if (data.TableNames.includes(`Scenarios_Data`)) { return; }
	
	let params = {
		TableName: `Scenarios_Data`,
		KeySchema: [
			{ AttributeName: "WorkerID", KeyType: "HASH" },
			{ AttributeName: "InstanceIndex", KeyType: "RANGE" }
		],
		AttributeDefinitions: [
			{ AttributeName: "WorkerID", AttributeType: "S" },
			{ AttributeName: "InstanceIndex", AttributeType: "N" },
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	};
	dynamodb.createTable(params, createTableCallback);
	console.log('Scenarios_Data table created.');
}

function CreatePlayersTable(data) {
	if (data.TableNames.includes('Players')) { return; } 

	let params = {
		TableName: "Players",
		KeySchema: [{
			AttributeName: "WorkerID",
			KeyType: "HASH"
		}],
		AttributeDefinitions: [{
			AttributeName: "WorkerID",
			AttributeType: "S"
		}],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	};
	dynamodb.createTable(params, createTableCallback);
	console.log('Players table created.');
}

function isFloat(_number) {
	const number = Number(_number);
    return parseInt(number, 10) !== number &&
           parseFloat(number, 10) === number;
}