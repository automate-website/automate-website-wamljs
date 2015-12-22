'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function anyOfElementsVisible(selector, ignoreElementNotFound){
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
					
					return someOfElementsVisible.call(this, elements, ignoreElementNotFound);
				});
}

function someOfElementsVisible(elements, ignoreElementNotFound){
	var nextElement = elements.shift(),
		nextElementId = idOfElement(nextElement);
	
	return this.elementIdDisplayed(nextElementId)
		.then(function(response){
			if(response.state === 'success'){
				return nextElementId;
			} else {
				if(_.isEmpty(elements)){
					if(ignoreElementNotFound){
						return false;
					} else {
						throw new ErrorHandler.CommandError('none of the elements are visible (' + text + ')');
					}
				}
				return someOfElementsVisible.call(this, elements, ignoreElementNotFound);
			}
		});
}

function idOfElement(element){
	return element.ELEMENT;
}

module.exports = anyOfElementsVisible;