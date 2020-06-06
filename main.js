const express = require('express')
const pug = require('pug');
const bodyParser = require("body-parser");
const rf = require('./readFiles');
const ts = require('./testResults');
const runner = require('./testRunner');
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
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/suites', function (req, res) {
	 res.render('index', { 'data': rf.getfiles()});
});
app.get("/status", function(req,res) {
	res.render('status');
});
app.get("/getstat", function(req,res) {
	console.log("Requested the status.......")
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
	if (fs.existsSync(resultFile)) {
		data["suite"] = fs.readFileSync(resultFile, 'utf8')
	}
//	console.log(data);
	res.send(data);
});

app.post("/run", function(req,res) {
	var data = Object.values(req.body);
	var suiteLst= [];
	ts.clearPreviousResult();
	fs.writeFile(statFile, data.length , function (err) {
		  if (err) throw err;
	});
	

	data.forEach(function display(value) { 
		var suite = { collection: path.join(__dirname, 'suites/' + value  ), reporters: 'html',  reporter : { html : { export : './newman/htmlResults.html'}}};
		var cmd = function (done) {
			console.log("Running Suite..." + value);
			newman.run(suite, ts.processCollection).
			on('start', function (err, args) {
				console.log("Finished Suite..." + value);
				fs.appendFile(statFile, "\n"+value , function (err) {
					  if (err) throw err;
					});
			})
		};
		suiteLst.push(cmd);
	} );
	console.log(suiteLst.length);
	ts.setCollectionCount(suiteLst.length);
//	suiteLst.push(ts.saveResult());
	
	runner.runSuite(suiteLst)
	console.log("Started....");
//	var i=0;
//	suiteLst.forEach(function display(value) {
//		i=i+1;
//		setTimeout(value, i* 2000);
//	});
	setTimeout(() => ts.waitForFinishAndSave(ts.saveResult), 0);
	console.log("Redirecting ....");
//	res.render('status', {'tot': suiteLst.length});
	res.send('done');
	
});

app.listen(port, () => console.log(`Suite runner started. listening on port ${port}!`))