'use strict';

var util = require('util');

var filename = process.argv[process.argv.length - 1];

if (filename == module.filename) {
	var cmdline = process.argv.map(function(item) {
		var i = item.split('/');
		return i[i.length - 1];
	});
	console.log(util.format('Usage: %s <definitions.csv>', cmdline.join(' ')));
	process.exit();
}

var aggregationByUrl = {};
var aggregationByStatus = {};

var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream(filename)
});

lineReader.on('line', function (line) {
	var fields = line.split(' ') || [];
	var lineObj = {};
	fields.forEach(function(field) {
		var keyValuePair = field.split("=");
		var key = keyValuePair[0];
		var value = keyValuePair[1]
		lineObj[key] = value;
	});
	if (lineObj['request_to']) {
		aggregationByUrl[lineObj['request_to']] = (aggregationByUrl[lineObj['request_to']] || 0) + 1;
		aggregationByStatus[lineObj['response_status']] = (aggregationByStatus[lineObj['response_status']] || 0) + 1;
	}
});

lineReader.on('close', function() {
	var orderedRequests = [];
	for (var url in aggregationByUrl) {
		orderedRequests.push({ 'url': url, total: aggregationByUrl[url]});
	}
	orderedRequests.sort(function(a, b) {
		return a > b;
	});
	for (var i = 0; i < 3; i++) {
		console.log(orderedRequests[i].url + ' - ' + orderedRequests[i].total);
	}
	for (var status in aggregationByStatus) {
		console.log(status + ' - ' + aggregationByStatus[status]);
	}
})