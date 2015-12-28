'use strict';

var _    = require('lodash-node'),
	Step = require('./step.js');

function ScreenShooter(options){
    this.options = options;
}

ScreenShooter.prototype.isScreenshotRequired = function(command){
	return !_.includes(Step.NonInteractiveCommands, command);
};

ScreenShooter.prototype.takeScreenshot = function(state, sessionId){
	var promise = state.promise;
	if(this.isScreenshotRequired(state.stepName)){
		return promise.saveScreenshot(getFileName(state, sessionId, this.options.screenshotPath))
	} else {
		return promise;
	}
};

ScreenShooter.prototype.takeScreenshotOnError = function(state, sessionId){
	var promise = state.promise;
	if(this.isScreenshotRequired(state.stepName)){
		return promise.next(promise.saveScreenshot, 
				[getFileName(state, sessionId, this.options.screenshotPath)], 
				'saveScreenshot');
	} else {
		return promise;
	}
};

function getFileName(state, sessionId, screenshotPath){
    var formattedStepName = state.stepName
            .replace(/ /g,"_")
            .toLowerCase(),
        errorContext = state.errorContext;
    return screenshotPath + sessionId + '_' + state.stepCount + '_' + formattedStepName + (errorContext ? '_error' : '') + '.png';
}

module.exports = ScreenShooter;