var fs = require('fs');
var  dt= [];
var suiteTypes = {"postman" : "json", "selenium":"java"}
exports.getfiles = function () {
	dt=[''];
	fs.readdirSync(__dirname + "//suites").forEach(file => {
		var ss = require('./settings.json');
		if(file.endsWith(suiteTypes[ss.suite])) {
			dt.push(file);
		}
	});
	dt.shift();
	return dt;
};


