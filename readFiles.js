/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var path = "C:\\Users\\dd250276\\Dev\\GitLab\\ofx-postman\\ofx-services-transactions";
var  dt=[' '];
exports.getfiles = function () {
	fs.readdirSync(path).forEach(file => {	
		if(file.endsWith("json")) {
			dt.push(file);
		}
	});
	dt.shift();
	console.log(dt)
	return dt;
};
