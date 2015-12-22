'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function anyOfElementsContainsText(selector, text, ignoreElementNotFound){
	return this.elements(selector)
				.then(function(response){
					var elements = response.value;
					if(_.isEmpty(elements)){
						if(ignoreElementNotFound){
							return;
						} else {
							throw new ErrorHandler.CommandError('no element was found using selector (' + selector + ')');
						}
					}
					
					return someElementContainsText.call(this, elements, text, ignoreElementNotFound);
				});
}

function someElementContainsText(elements, text, ignoreElementNotFound){
	var nextElement = elements.shift(),
		nextElementId = idOfElement(nextElement);
	
	return this.elementIdText(nextElementId)
		.then(function(response){
			var actualText = response.value;
			if(_.isString(actualText) && actualText.indexOf(text) > -1){
				return nextElementId;
			} else {
				if(_.isEmpty(elements)){
					if(ignoreElementNotFound){
						return false;
					} else {
						throw new ErrorHandler.CommandError('none of the elements contain text (' + text + ')');
					}
				}
				return someElementContainsText.call(this, elements, text, ignoreElementNotFound);
			}
		});
}

function idOfElement(element){
	return element.ELEMENT;
}

module.exports = anyOfElementsContainsText;