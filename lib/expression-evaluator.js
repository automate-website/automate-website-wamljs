'use strict';

var
	_  = require('lodash-node'),
	Chance = require('chance');

var interpolate = /\$\{([\s\S]+?)\}/g;

function ExpressionEvaluator(){
	this.context = { '$' : { random : new Chance() } };
};

ExpressionEvaluator.prototype.assign = function(obj){
	_.assign(this.context, obj);
};

ExpressionEvaluator.prototype.getValue = function(expression){
	if(!_.isString(expression)){
		return expression;
	}
	return _.template(expression, { 'interpolate' : interpolate })(this.context);
};

module.exports = ExpressionEvaluator;