'use strict';

var util = require('util');

var filename = process.argv[process.argv.length - 1];

if (filename == module.filename) {
	var cmdline = process.argv.map(function(item) {
		var i = item.split('/');
		return i[i.length - 1];
	});
	console.log(util.format('Usage: %s <path_to_log_file>', cmdline.join(' ')));
	console.log('Check https://github.com/akiroso/node-parser/blob/master/README.md for more information');
	process.exit();
}

// create two objects in which we'll keep track of the consolidated data
var aggregationByUrl = {};
var aggregationByStatus = {};

var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream(filename)
});

// For each line we read the data and add the relevant information to 2 objects designated to hold the consolidated data
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
		// here we increment a counter for both url and status aggregations that we are interested on
		aggregationByUrl[lineObj['request_to']] = (aggregationByUrl[lineObj['request_to']] || 0) + 1;
		aggregationByStatus[lineObj['response_status']] = (aggregationByStatus[lineObj['response_status']] || 0) + 1;
	}
});

lineReader.on('close', function() {
	// finally, after reading the whole file, we sort the url by most requested to print the info
	var orderedRequests = [];
	for (var url in aggregationByUrl) {
		orderedRequests.push({ 'url': url, total: aggregationByUrl[url]});
	}
	orderedRequests = orderedRequests.sort(function(a, b) {
		return b.total - a.total;
	});
	for (var i = 0; i < 3; i++) {
		console.log(orderedRequests[i].url + ' - ' + orderedRequests[i].total);
	}
	// and then also print all the status and respective counters
	for (var status in aggregationByStatus) {
		console.log(status + ' - ' + aggregationByStatus[status]);
	}
})