/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var path = ".\\";
var  dt= [];

exports.getfiles = function () {
	dt=[''];
	var n='';
	fs.readdirSync(__dirname + "//suites").forEach(file => {	
		if(file.endsWith("json")) {
			dt.push(file);
		}
	});
	dt.shift();
	return dt;
};


