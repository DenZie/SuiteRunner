const express = require('express')
const pug = require('pug');
const bodyParser = require("body-parser");
const rf = require('./readFiles');
const app = express()
const fs = require('fs');
const readline = require('readline');
const statFile = 'status.txt'
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const path = require('path')
//const async = require('async')
const newman = require('newman')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
	var tot='0';
	var ran = Math.floor(Math.random() * Math.floor(100));
	var lineReader  = readline.createInterface({
		input: require('fs').createReadStream(statFile),
	});
	lineReader.on('line', function (line) {
		tot = line;
		lineReader.close();
	});
	fileBuffer =  fs.readFileSync(statFile);
	to_string = fileBuffer.toString();
	split_lines = to_string.split("\n");
	var data = {"tot": parseInt(tot), "cur": split_lines.length-1};
	res.send(data);
});

app.post("/run", function(req,res) {
	var data = Object.values(req.body);
	var suiteLst= [];
	
	fs.writeFile(statFile, data.length , function (err) {
		  if (err) throw err;
		});
	
	data.forEach(function display(value) { 
		var suite = { collection: path.join(__dirname, 'suites/' + value  ), reporters: 'html',  reporter : { html : { export : './newman/htmlResults.html'}}};
		var cmd = function (done) {
			newman.run(suite).
			on('start', function (err, args) {
				console.log("starting Suite :- " + value)
				fs.appendFile(statFile, "\n"+value , function (err) {
					  if (err) throw err;
					});
			})
		};
		suiteLst.push(cmd);
	} );
	var i=0;
	suiteLst.forEach(function display(value) {
		i=i+1;
		setTimeout(value, i* 5000);
	});
	  res.render('status', {'tot': suiteLst.length});
});

app.listen(port, () => console.log(`Suite runner started. listening on port ${port}!`))