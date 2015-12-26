'use strict';

var
	parseArgs 	= require('minimist'),
	path 		= require('path'),
	log4js 		= require('log4js'),
	logLevel 	= parseArgs(process.argv.slice(2)).logLevel || 'INFO';

function logger(fileName) {
	var logger = log4js.getLogger(path.basename(fileName));
	logger.setLevel(logLevel);
	return logger;
};

module.exports = logger;