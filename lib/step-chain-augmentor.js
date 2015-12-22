'use strict';

var
	util = require('util'),
	events = require('events'),
	uuid = require('node-uuid'),
	_  = require('lodash-node');

var takeScreenshots =  {
    onFailure : 'ON_FAILURE',
    onEveryStep : 'ON_EVERY_STEP',
    never : 'NEVER'
};

function StepChainAugmentor(options, screenShooter) {
	this.options = options;
	this.screenShooter = screenShooter;
    this.state = { stepCount : 0, failed : false };
    this.sessionId = uuid.v1().replace(/-/g,"");
    events.EventEmitter.call(this);
};

util.inherits(StepChainAugmentor, events.EventEmitter);

StepChainAugmentor.prototype.augment = function(promise, step){
	var stepName = step.getCommand(), 
		stepContext = step.getContext(),
		state = _.assign(this.state, { 
    	'stepName' : stepName, 
    	'stepContext' : stepContext, 
    	'promise' : promise,
    	'stepCount' : this.state.stepCount + 1
    });
	
	this.bindEvents();

	return this.takeScreenshotIfRequired();
}

StepChainAugmentor.prototype.bindEvents = function(){
	var that = this,
		state = that.state,
		promise = state.promise,
		momentState = _.clone(state);
	
    state.promise = promise.then( 
    	function(){ // step succeeded
    		onSuccess(that, momentState);
        },
        function(errorContext){ // step failed
        	onFail(that, momentState, errorContext);
        }
    );
};

function onSuccess(augmentor, momentState){
	var stepName = momentState.stepName,
		promise = momentState.promise,
		stepContext = momentState.stepContext,
		stepCount = momentState.stepCount;
	
	if(stepName === 'end'){
		augmentor.emit('scenario:end');
		return;
	}
	
	augmentor.emit('step:succeeded', stepName, stepContext, 
            null, promise, stepCount, augmentor.sessionId);
}

function onFail(augmentor, momentState, errorContext){
	var stepName = momentState.stepName,
		promise = momentState.promise,
		stepContext = momentState.stepContext,
		stepCount = momentState.stepCount,
		currentState = augmentor.state;
	
	if(stepName === 'end'){
		augmentor.emit('scenario:end', errorContext);
		return;
	}
	
	if(currentState.failed) {
    	errorContext = { 'message' : 'Cancelled.' };
    }
	
	augmentor.emit('step:failed', stepName, stepContext, 
            errorContext, promise, stepCount, augmentor.sessionId);
    
	if(currentState.failed){
		promise.reject();
    } else {
    	currentState.failed = true;
    	augmentor
        	.takeScreenshotOnErrorIfRequired(promise, stepName, stepCount, errorContext)
        	.end();
    }
};

StepChainAugmentor.prototype.takeScreenshotOnErrorIfRequired = function(promise, stepName, stepCount, errorContext){
	var _takeScreenshots = this.options.takeScreenshots;

	if(_.includes([takeScreenshots.onFailure, takeScreenshots.onEveryStep], _takeScreenshots)){
		return this.screenShooter.takeScreenshotOnError({
			'promise' : promise,
			'stepName' : stepName, 
			'stepCount' : stepCount, 
			'errorContext' : errorContext 
		}, this.sessionId);
	}
	return promise;
};

StepChainAugmentor.prototype.takeScreenshotIfRequired = function(){
    var state = this.state,
    	promise = state.promise,
    	stepName = state.stepName,
    	_takeScreenshots = this.options.takeScreenshots;
    
    if(!_.includes(['screenshot', 'end'], stepName) && takeScreenshots.onEveryStep == _takeScreenshots){
    	promise = this.screenShooter.takeScreenshot(state, this.sessionId);
    }
    
	return promise;
};

module.exports = StepChainAugmentor;
