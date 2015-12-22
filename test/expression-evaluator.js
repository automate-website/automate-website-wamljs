var assert = require('assert'),
	ExpressionEvaluator = require('../lib/expression-evaluator'),
	evaluator = new ExpressionEvaluator();

describe("ExpressionEvaluator", function(){
	it("simple existing variable is replaced", function() {
		evaluator.assign( {'x' : 'y'} );
		
		assert.equal(evaluator.getValue('x is not ${x}'), 'x is not y');
	});
	
	it("complex existing variable is replaced", function() {
		evaluator.assign( {'x' : { 'y' : 'z'} } );
		
		assert.equal(evaluator.getValue('x is not ${x.y}'), 'x is not z');
	});
	
	it("simple arithmetical operations are performed", function() {
		evaluator.assign({ 'x' : 1, 'y' : 2 });
		
		assert.equal(evaluator.getValue('x is not ${x + y}'), 'x is not 3');
		assert.equal(evaluator.getValue('x is not ${x - y}'), 'x is not -1');
		assert.equal(evaluator.getValue('x is not ${x * y}'), 'x is not 2');
	});
	
	it("strings are concatenated", function() {
		assert.equal(evaluator.getValue('x is not ${"y" + " but x"}'), 'x is not y but x');
	});
	
	it("chance library may be utilized", function(){
		assert.doesNotThrow(function (){evaluator.getValue('${ $.random.phone() }')});
	});
});
