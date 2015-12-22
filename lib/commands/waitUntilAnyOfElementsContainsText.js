'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function waitUntilAnyOfElementsContainsText(selector, text, ms){
	return this.waitUntil(function(){
		return this.anyOfElementsContainsText(selector, text, true);
	}, ms);
}

module.exports = waitUntilAnyOfElementsContainsText;