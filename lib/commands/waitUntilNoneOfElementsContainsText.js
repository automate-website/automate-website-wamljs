'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function waitUntilNoneOfElementsContainsText(selector, text, ms){
	return this.waitUntil(function(){
		return this.noneOfElementsContainsText(selector, text);
	}, ms);
}

module.exports = waitUntilNoneOfElementsContainsText;