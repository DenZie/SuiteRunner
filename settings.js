var ss = require("./settings.json")
const fs = require('fs');
const settingsFile = "settings.json"
exports.getSettings = function () {
	delete require.cache[require.resolve("./settings.json")];  
	var ss = require('./settings.json');
	return ss;
};

exports.save = function(data) {
	fs.writeFile(settingsFile, JSON.stringify(data), function (err) {
	  if (err) throw err;
	});
}