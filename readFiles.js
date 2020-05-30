/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var path = ".\\";
var  dt= [];

exports.getfiles = function () {
	dt=[''];
	var n='';
	fs.readdirSync(__dirname).forEach(file => {	
		console.log(file)
		if(file.endsWith("json")) {
			console.log(file)
			dt.push(file);
		}
	});
	dt.shift();
	return dt;
};


