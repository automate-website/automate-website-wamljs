'use strict';

var
	_  = require('lodash-node'),
	ErrorHandler = require('../../node_modules/webdriverio/lib/utils/ErrorHandler.js');

function waitUntilAnyOfElementsContainsTextAndClick(selector, text, ms){
	return this.waitUntil(function(){
		return this.anyOfElementsContainsText(selector, text, true);
	}, ms).then(function(elementId){
	    return this.elementIdClick(elementId)
            .then(function(response){
                if(!response.state === 'success'){
                    throw new ErrorHandler.CommandError('element with id (' + elementId + ') could not be clicked.');
                }
            });
	});
}

module.exports = waitUntilAnyOfElementsContainsTextAndClick;