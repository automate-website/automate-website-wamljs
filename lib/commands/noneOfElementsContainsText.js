'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function noneOfElementsContainsText(selector, text){
	return this.elements(selector)
				.then(function(response){
					var elements = response.value;
					if(_.isEmpty(elements)){
						return true;
					}
					
					return someElementContainsText.call(this, elements, text);
				});
}

function someElementContainsText(elements, text){
	var nextElement = elements.shift(),
		nextElementId = idOfElement(nextElement);
	
	return this.elementIdText(nextElementId)
		.then(function(response){
			var actualText = response.value;
			if(_.isString(actualText) && actualText.indexOf(text) > -1){
				return false;
			} else {
				if(_.isEmpty(elements)){
					return true;
				}
				return someElementContainsText.call(this, elements, text);
			}
		});
}

function idOfElement(element){
	return element.ELEMENT;
}

module.exports = noneOfElementsContainsText;