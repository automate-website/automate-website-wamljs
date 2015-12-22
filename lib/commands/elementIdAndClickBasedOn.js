'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function elementIdAndClickBasedOn(elementId, selector){
	return this.elementIdElement(elementId, selector)
		.then(function(response){
			var element = response.value;
			if(!element){
				throw new ErrorHandler.CommandError('no element was found using selector (' + selector + ') based on selected element id (' + elementId + ')');
			}
			return idOfElement(element);
		})
		.then(function(elementId){
			return this.elementIdClick(elementId)
				.then(function(response){
					if(!response.state === 'success'){
						throw new ErrorHandler.CommandError('element with id (' + elementId + ') could not be clicked.');
					}
				});
		});
}

function idOfElement(element){
	return element.ELEMENT;
}

module.exports = elementIdAndClickBasedOn;