'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function waitUntilAnyOfElementsHasValue(selector, value, ms){
	return this.waitUntil(function(){
		return this.anyOfElementsHasValue(selector, value, true);
	}, ms);
}

module.exports = waitUntilAnyOfElementsHasValue;