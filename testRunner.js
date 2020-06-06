const fs = require('fs');
const resultFile = 'result.json'

exports.runSuite = async function runPostManSuite(suiteLst) {
	var i=0;
	suiteLst.forEach(function display(value) {
		i=i+1;
		setTimeout(value, i* 2000);
	});
}