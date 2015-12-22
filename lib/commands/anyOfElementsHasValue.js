'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function anyOfElementsHasValue(selector, value, ignoreElementNotFound){
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
					
					return someElementHasValue.call(this, elements, value, ignoreElementNotFound);
				});
}

function someElementHasValue(elements, value, ignoreElementNotFound){
	var nextElement = elements.shift(),
		nextElementId = idOfElement(nextElement);
	
	return this.elementIdAttribute(nextElementId, 'value')
		.then(function(response){
			var actualValue = response.value;
			if(_.isString(actualValue) && actualValue === value){
				return nextElementId;
			} else {
				if(_.isEmpty(elements)){
					if(ignoreElementNotFound){
						return false;
					} else {
						throw new ErrorHandler.CommandError('none of the elements has value (' + value + ')');
					}
				}
				return someElementHasValue.call(this, elements, value, ignoreElementNotFound);
			}
		});
}

function idOfElement(element){
	return element.ELEMENT;
}

module.exports = anyOfElementsHasValue;