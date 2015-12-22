'use strict';

var
    _  = require('lodash-node'),
    fs = require('fs');

var 
	executionStatusFailed = 'failed',
	executionStatusDone = 'done';

function Reporter(reportPath){
    this.reportPath = reportPath;
	this.status = executionStatusDone;
	this.time = 0.0;
	this.numScenarioTotal = 0;
	this.numScenarioPasses = 0;
	this.numScenarioFailures = 0;
	this.numStepPasses = 0;
	this.numStepFailures = 0;
	this.scenarios = [];
}

Reporter.prototype.addScenario = function(doc, eventAdapter){
	var scenario = new Scenario(doc.title, doc.baseUrl, eventAdapter.sessionId),
		that = this;

	this.scenarios.push(scenario);
	
	eventAdapter.on('step:succeeded', function (name, context) {
		scenario.addStep(name, context);
	});

	eventAdapter.on('step:failed', function(name, context, error) {
		scenario.addStep(name, context, error);
	});

	eventAdapter.on('scenario:end', function() {
		scenario.end();
		that.write(that.reportPath);
	});
	
	return scenario;
};

Reporter.prototype.updateMetrics = function(){
	var metrics = _.chain(this.scenarios)
		.each(function(scenario){
			scenario.updateMetrics();
		})
		.reduce(function(_metrics, scenario){
			
			if(scenario.numStepFailures > 0){
				_metrics.numScenarioFailures++;
			} else {
				_metrics.numScenarioPasses++;
			}
			_metrics.numStepPasses = _metrics.numStepPasses + scenario.numStepPasses;
			_metrics.numStepFailures = _metrics.numStepFailures + scenario.numStepFailures;
			_metrics.numScenarioTotal++;
			_metrics.time = _metrics.time + scenario.time;
			
			return _metrics;
		}, { 'status' : executionStatusDone,
			'numStepPasses' : 0,
			'numStepFailures' : 0,
			'numScenarioTotal' : 0,
			'numScenarioPasses' : 0,
			'numScenarioFailures' : 0,
			'time' : 0
		})
		.value();
	
	var status = metrics.numScenarioFailures > 0 ? executionStatusFailed : executionStatusDone;
	metrics.status = status;
	
	_.assign(this, metrics);
};

Reporter.prototype.write = function(_fileName){
	var fileName = _.isString(_fileName) ? _fileName : './scenario-report.json';
	
	this.updateMetrics();
	
	var model = getPresentationModel(this);
	
	fs.writeFile(fileName, JSON.stringify(model, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("Saving scenarios report to " + fileName);
	    }
	}); 
};

function getPresentationModel(reporter){
	var model = _.cloneDeep(reporter);
	
	model.time = round(model.time);
	_.each(model.scenarios, function(scenario){
		scenario.time = round(scenario.time);
		scenario.steps = _.map(scenario.steps, function(step){
			var stepName = step.name,
				modelStep = {},
				context = step.context;
			
			_.assign(context, step.error);
			_.assign(context, {'status' : step.status});
			_.assign(modelStep, context);
			modelStep.name = step.name;
			return modelStep;
		});
	});
	return model;
};

function round(num){
	return Math.round(num * 100) / 100;
}

function Scenario(title, baseUrl, sessionId){
	this.time = new Date().getTime() / 1000;
	this.numStepPasses = 0;
	this.numStepFailures = 0;
	this.title = title;
	this.baseUrl = baseUrl;
	this.status = executionStatusDone;
	this.steps = [];
	this.sessionId = sessionId;
}

Scenario.prototype.addStep = function(name, context, error){
	var step = new Step(name, context, error);
	this.steps.push(step);
	return step;
};

Scenario.prototype.getStatus = function(){
	return this.status;
};

Scenario.prototype.end = function(){
	this.time = new Date().getTime() / 1000 - this.time;
};

Scenario.prototype.updateMetrics = function(){
	var metrics = _.chain(this.steps)
		.map(function(step){
			return step.getStatus();
		})
		.reduce(function(_metrics, stepStatus){
			if(stepStatus == executionStatusFailed){
				_metrics.numStepFailures++;
			} else {
				_metrics.numStepPasses++;
			}
			return _metrics;
		}, { 'status' : executionStatusDone,
			'numStepPasses' : 0,
			'numStepFailures' : 0
		})
		.value();
	
	var status = metrics.numStepFailures > 0 ? executionStatusFailed : executionStatusDone;
	metrics.status = status;

	_.assign(this, metrics);
};

function Step(name, context, error){
	this.name = name;
	this.context = _.isString(context) || _.isNumber(context) ? { 'value' : context } : context;
	this.error = error;
	this.status = this.error ? executionStatusFailed : executionStatusDone;
}

Step.prototype.getStatus = function(){
	return this.status;
};

module.exports = Reporter;
