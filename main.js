const express = require('express')
const pug = require('pug');
const formidable = require('formidable');
const bodyParser = require("body-parser");
const rf = require('./readFiles');
const ts = require('./testResults');
const runner = require('./testRunner');
const settings = require('./settings');
const app = express()
const fs = require('fs');
const readline = require('readline');
const statFile = 'status.txt'
const resultFile = 'result.json'
	
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

app.get('/settings', function (req, res) {
	var data = {"data" : settings.getSettings()};
	res.render('settings', data);
});

app.post('/settings', function (req, res) {
	settings.save(req.body);
	var data = {"data" : req.body};
 res.render('settings', data);
});


app.get('/runSuite', function (req, res) {
	 res.render('runSuite', { 'data': rf.getfiles()});
});

app.get("/status", function(req,res) {
	res.render('status');
});

app.get("/getReslt", function(req,res) {
	var suite = "";
	if (fs.existsSync(resultFile)) {
		suite = fs.readFileSync(resultFile, 'utf8')
	}	
	res.send({'suite': suite});
});

app.get("/result", function(req,res) {
	res.render('result');
});

app.get("/upload", function(req,res) {
	console.log("get upload");
	res.render('upload');
});

app.post("/upload", function(req,res) {
	console.log(req);
	if (req.url == '/upload') {
		var form = new formidable.IncomingForm();
	    form.parse(req, function (err, fields, files) {
	    	var oldpath = files.filetoupload.path;
	    	var newpath = __dirname + '/suites/' + files.filetoupload.name;
	    	console.log(newpath);
	        fs.rename(oldpath, newpath, function (err) {
	            if (err) throw err;
	            	res.render('runSuite', { 'data': rf.getfiles()});
	          });
	    });
	} else {
		res.render('upload');
	}
});

app.get("/getstat", function(req,res) {
	var tot = 0;
	var ran = Math.floor(Math.random() * Math.floor(100));
	fileBuffer =  fs.readFileSync(statFile);
	to_string = fileBuffer.toString();
	split_lines = to_string.split("\n");
	var data = {"tot": split_lines[0], "cur": split_lines.length-1};
	res.send(data);
});

app.post("/run", function(req,res) {
	var data = Object.values(req.body);
	var suiteLst= [];
	ts.clearPreviousResult();
	fs.writeFile(statFile, data.length , function (err) {
		  if (err) throw err;
	});
	data.forEach(function (value) { 
		var ss = require('./settings.json');
		console.log("suiteTypes" + ss.suite)
		if(ss.suite ==="postman") {
			var suite = { collection: path.join(__dirname, 'suites/' + value  ), reporters: 'html',  reporter : { html : { export : './newman/htmlResults.html'}}};
			var cmd = function (done) {
				newman.run(suite, ts.processCollection).
				on('start', function (err, args) {
					fs.appendFile(statFile, "\n"+value , function (err) {
					  if (err) throw err;
					});
				})
			};
			suiteLst.push(cmd);
		}
	});
	ts.setCollectionCount(suiteLst.length);
	runner.runSuite(suiteLst)
	res.render('status', {'tot': suiteLst.length});
});
app.get("/delete", function(req,res) {
	res.render('deleteSuite', { 'status':"n",'data': rf.getfiles()});
});
app.post("/delete", function(req,res) {
	var data = Object.values(req.body);
	data.forEach(function display(value) {
		if (fs.existsSync(__dirname, 'suites/' + value)) {
			fs.unlinkSync(__dirname + '/suites/' + value);
		}
	} );
	res.render('deleteSuite', { 'status':"y", 'data': rf.getfiles()});
});

app.listen(port, () => console.log(`Suite runner started. listening on port ${port}!`))