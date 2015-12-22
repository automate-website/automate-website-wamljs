'use strict';

function ScreenShooter(options){
    this.options = options;
}

ScreenShooter.prototype.takeScreenshot = function(state, sessionId){
	var promise = state.promise;
	return promise.saveScreenshot(getFileName(state, sessionId, this.options.screenshotPath))
};

ScreenShooter.prototype.takeScreenshotOnError = function(state, sessionId){
	var promise = state.promise;
	return promise.next(promise.saveScreenshot, 
			[getFileName(state, sessionId, this.options.screenshotPath)], 
			'saveScreenshot');
}

function getFileName(state, sessionId, screenshotPath){
    var formattedStepName = state.stepName
            .replace(/ /g,"_")
            .toLowerCase(),
        errorContext = state.errorContext;
    return screenshotPath + sessionId + '_' + state.stepCount + '_' + formattedStepName + (errorContext ? '_error' : '') + '.png';
}

module.exports = ScreenShooter;