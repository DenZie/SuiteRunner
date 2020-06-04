const express = require('express')
const pug = require('pug');
//const bodyParser = require("body-parser");
const rf = require('./readFiles');
const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const path = require('path')
//const async = require('async')
const newman = require('newman')

app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

const port = 3000
app.set('view engine', 'pug');
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/suites', function (req, res) {
	 res.render('index', { 'data': rf.getfiles()});
});
app.get("/status", function(req,res) {
	res.render('status');
});
app.get("/getstat", function(req,res) {
	var ran = Math.floor(Math.random() * Math.floor(100));
	var data = {"tot":10, "cur": ran};
	res.send(data);
});

app.post("/run", function(req,res) {
	var data = req.body;
	console.log(data);
	console.log("-----------------");
	newman.run({
		collection: require('./suites/Demo-1.postman_collection.json'),
		reporters: 'cli'
		}, function (err) {
		if (err) { throw err; }
		console.log('collection run complete!');
	});
	  res.render('status');
});

app.listen(port, () => console.log(`Suite runner started. listening on port ${port}!`))