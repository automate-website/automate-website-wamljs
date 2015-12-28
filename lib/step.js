'use strict';

var
	_  = require('lodash-node');

_.mixin(require("lodash-deep"));
_.mixin({'firstKey' : function(obj){
	return _.chain(obj)
		.keys()
		.first()
		.value();
	}, 'firstValue': function(obj){
	return _.chain(obj)
		.values()
		.first()
		.value();
}});

function Step(command, context){
	this.command = command;
	this.context = context;
}

Step.Commands = {
	Store : 'store'
};

Step.NonInteractiveCommands = [
   Step.Commands.Store
];

Step.ArgumentOrder = ['url', 'selector', 'text', 'value', 'basedOnSelector', 'ms'];

Step.ofRawStep = function(rawStep){
	var command = commandOfStep(rawStep),
		context = contextOfStep(rawStep);
	
	return new Step(command, context);
};

Step.End = new Step('end');

Step.prototype.getContext = function(){
	return this.context;
};

Step.prototype.getContextAsArguments = function(){
	var context = this.context;
	
	if(!_.isObject(context)){
		return [context];
	} else {
		return _.chain(this.context)
			.map(function(value, key){
				return _.set({}, key, value);
			})
			.sort(function(left, right){
				return sortByArgumentOrder(_.firstKey(left), _.firstKey(right));
			})
			.map(_.firstValue)
			.value();
	}
};

Step.prototype.getCommand = function(){
	return this.command;
}

Step.prototype.map = function(transform){
	var context = this.getContext(),
		transformedStepCommand = transform(this.getCommand()),
		transformedStepContext = _.deepMapValues(context, function(value){
			return enforceCorrectType(transform(value));
		});
	return new Step(transformedStepCommand, transformedStepContext);
}

function enforceCorrectType(value){
	var intValue = parseInt(value);
	if(intValue && intValue.toString().length == value.length){
		return intValue;
	}
	return value;
}

function sortByArgumentOrder(left, right){
	var argumentOrder = Step.ArgumentOrder,
		leftIndex = _.indexOf(argumentOrder, left),
		rightIndex = _.indexOf(argumentOrder, right);

	return leftIndex > rightIndex ? 1 : (leftIndex < rightIndex ? -1 : 0);
}

function contextOfStep(step){
	return _.firstValue(step);
}

function commandOfStep(step){
	return _.firstKey(step);
}

module.exports = Step;