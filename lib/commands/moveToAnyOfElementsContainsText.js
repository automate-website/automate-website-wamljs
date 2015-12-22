'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function moveToAnyOfElementsContainsText(selector, text, ms){
	return this.waitUntilAnyOfElementsContainsText(selector, text, ms)
	    .then(function(elementId){
    	    return this.moveTo(elementId)
    	        .then(function(response){
    	            if(!response.state === 'success'){
                        throw new ErrorHandler.CommandError('could not move to the element with id (' + elementId + ').');
                    }
    	        });
	    });
}

module.exports = moveToAnyOfElementsContainsText;