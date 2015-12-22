'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function anyOfElementsContainsTextAndClickBasedOn(selector, text, basedOnSelector){
	return this.anyOfElementsContainsText(selector, text)
		.then(function(elementId){
			return this.elementIdAndClickBasedOn(elementId, basedOnSelector);
		});
}

module.exports = anyOfElementsContainsTextAndClickBasedOn;