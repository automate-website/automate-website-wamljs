'use strict';

var
	_  = require('lodash-node'),
	anyOfElementsContainsText = require('./commands/anyOfElementsContainsText.js'),
	anyOfElementsContainsTextAndClickBasedOn = require('./commands/anyOfElementsContainsTextAndClickBasedOn.js'),
	waitUntilAnyOfElementsContainsTextAndClickBasedOn = require('./commands/waitUntilAnyOfElementsContainsTextAndClickBasedOn.js'),
	elementIdAndClickBasedOn = require('./commands/elementIdAndClickBasedOn.js'),
	waitUntilAnyOfElementsContainsTextAndClick = require('./commands/waitUntilAnyOfElementsContainsTextAndClick.js'),
	waitUntilAnyOfElementsContainsText = require('./commands/waitUntilAnyOfElementsContainsText.js'),
	anyOfElementsContainsTextAndClick = require('./commands/anyOfElementsContainsTextAndClick.js'),
	noneOfElementsContainsText = require('./commands/noneOfElementsContainsText.js'),
	waitUntilNoneOfElementsContainsText = require('./commands/waitUntilNoneOfElementsContainsText.js'),
	moveToAnyOfElementsContainsText = require('./commands/moveToAnyOfElementsContainsText.js'),
	anyOfElementsVisible = require('./commands/anyOfElementsVisible.js'),
	waitUntilAnyOfElementsVisibleAndClick = require('./commands/waitUntilAnyOfElementsVisibleAndClick.js'),
	anyOfElementsHasValue = require('./commands/anyOfElementsHasValue.js'),
	waitUntilAnyOfElementsHasValue = require('./commands/waitUntilAnyOfElementsHasValue.js');

var commandExtensions = {
	register : register	
};

var commands = [ 
	{ name : 'waitForContainsText', impl : waitForContainsText },
	{ name : 'anyOfElementsContainsTextAndClickBasedOn', impl : anyOfElementsContainsTextAndClickBasedOn },
	{ name : 'anyOfElementsContainsText', impl : anyOfElementsContainsText },
	{ name : 'waitUntilAnyOfElementsContainsTextAndClickBasedOn', impl : waitUntilAnyOfElementsContainsTextAndClickBasedOn },
	{ name : 'elementIdAndClickBasedOn', impl : elementIdAndClickBasedOn },
	{ name : 'waitUntilAnyOfElementsContainsTextAndClick', impl : waitUntilAnyOfElementsContainsTextAndClick },
	{ name : 'waitUntilAnyOfElementsContainsText', impl : waitUntilAnyOfElementsContainsText },
	{ name : 'anyOfElementsContainsTextAndClick', impl : anyOfElementsContainsTextAndClick },
	{ name : 'moveToAnyOfElementsContainsText', impl : moveToAnyOfElementsContainsText },
	{ name : 'waitUntilNoneOfElementsContainsText', impl : waitUntilNoneOfElementsContainsText },
	{ name : 'noneOfElementsContainsText', impl : noneOfElementsContainsText },
	{ name : 'anyOfElementsVisible', impl : anyOfElementsVisible },
	{ name : 'waitUntilAnyOfElementsVisibleAndClick', impl : waitUntilAnyOfElementsVisibleAndClick },
	{ name : 'anyOfElementsHasValue', impl : anyOfElementsHasValue },
	{ name : 'waitUntilAnyOfElementsHasValue', impl : waitUntilAnyOfElementsHasValue }
];

function register(client){
	_.each(commands, function(command){
		client.addCommand(command.name, command.impl);
	});
}

function waitForContainsText(selector, text, ms) {
    return this
        .waitForVisible(selector, ms)
        .getText(selector)
        .then(function(elementText) {
            if (elementText.indexOf(text) == -1) {
            	throw new Error('Assertion error: expected to find "' + text + '" in "' +  elementText + '".');
            }
        });
};

module.exports = commandExtensions;