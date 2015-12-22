var assert = require('assert'),
	_  = require('lodash-node'),
	Step = require('../lib/step.js');

function Transformer(multiplier){
	this.multiplier = multiplier;
}

Transformer.prototype.transform = function(value){
	return this.multiplier * value;
};

describe("Step", function(){
	it("a predefined end step exists and has command end", function() {
		var step = Step.End;
		
		assert.equal(step.getCommand(), 'end');
	});
	
	it("command and context fields are set when created by constructor", function() {
		var step = new Step('foo', 'bar');
		
		assert.equal(step.getCommand(), 'foo');
		assert.equal(step.getContext(), 'bar');
	});
	
	it("command and context fields are set when created of raw step", function() {
		var step = Step.ofRawStep({'foo' : 'bar'});
		
		assert.equal(step.getCommand(), 'foo');
		assert.equal(step.getContext(), 'bar');
		assert.deepEqual(step.getContextAsArguments(), ['bar'])
	});
	
	it("context arguments are returned when context is plain value", function() {
		var step = Step.ofRawStep({'foo' : 'bar'});
		
		assert.equal(step.getCommand(), 'foo');
		assert.equal(step.getContext(), 'bar');
		assert.deepEqual(step.getContextAsArguments(), ['bar'])
	});
	
	it("fields are mapped", function() {
		var step = new Step(1, 2),
			transformer = new Transformer(2),
			mappedStep = step.map(transformer.transform.bind(transformer));
		
		assert.equal(mappedStep.getCommand(), 2);
		assert.equal(mappedStep.getContext(), 4);
	});
	
	it("fields are deep mapped", function(){
		var step = new Step(1, { 'value' : 5, 'selector' : 3 }),
			transformer = new Transformer(2),
			mappedStep = step.map(transformer.transform.bind(transformer));
		
		assert.equal(mappedStep.getCommand(), 2);
		assert.deepEqual(mappedStep.getContext(), { 'value' : 10, 'selector' : 6 });
	});
	
	it("context arguments are returned in proper order when context is object", function(){
		var step = new Step(1, { 'value' : 5, 'selector' : 3 });
		
		assert.equal(step.getCommand(), 1);
		assert.deepEqual(step.getContext(), { 'value' : 5, 'selector' : 3 });
		assert.deepEqual(step.getContextAsArguments(), [3, 5]);
	});
});
