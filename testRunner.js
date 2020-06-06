const fs = require('fs');
const resultFile = 'result.json'

exports.runSuite = async function runPostManSuite(suiteLst) {
	var i=0;
	suiteLst.forEach(function display(value) {
		i=i+1;
		console.log("Running suite " + i + "after 2 second.");
		setTimeout(value, i* 2000);
	});
}