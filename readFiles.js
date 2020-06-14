var fs = require('fs');
var  dt= [];
const ds = require('./defaultSettings.json');
exports.getfiles = function () {
	dt=[''];
	fs.readdirSync(__dirname + "//suites").forEach(file => {
		var ss = require('./settings.json');
		if(file.endsWith(ds.suiteTypes[ss.suite])) {
			dt.push(file);
		}
	});
	dt.shift();
	return dt;
};


