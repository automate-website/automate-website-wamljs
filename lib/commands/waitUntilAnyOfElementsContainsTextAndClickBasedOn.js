'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function waitUntilAnyOfElementsContainsTextAndClickBasedOn(selector, text, basedOnSelector, ms){
	return this.waitUntilAnyOfElementsContainsText(selector, text, ms)
	    .then(function(elementId){
    		return this.elementIdAndClickBasedOn(elementId, basedOnSelector);
    	});
}

module.exports = waitUntilAnyOfElementsContainsTextAndClickBasedOn;