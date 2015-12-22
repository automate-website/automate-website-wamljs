var assert = require('assert'),
	_  = require('lodash-node'),
	preprocessor = require('../lib/scenario-preprocessor.js');

function createTestScenario(title){
	return { 'title' : title };
}

function createTestScenarioWithSteps(title, count, includePosition, includeScenarioTitle){
	return _.assign(createTestScenario(title), 
			{'steps' : createTestSteps(title, count, includePosition, includeScenarioTitle)});
}

function createTestSteps(scenarioTitle, count, includePosition, includeScenarioTitle){
	var steps = [];
	for(var i = 0; i < count; i ++){
		if(i === includePosition){
			steps.push({ include : includeScenarioTitle });
		} else {
			var step = {};
			step[scenarioTitle + '_step_' + i] = 'val';
			steps.push(step);
		}
	}
	return steps;
}

describe("ScenarioPreprocessor", function(){
	it("title document map should be build", function() {
		var scenarioA = createTestScenario('scenA'),
			scenarioB = createTestScenario('scenB'),
			scenarios = [scenarioA, scenarioB];
		
		assert.deepEqual(preprocessor.getTitleScenarioMap(scenarios), {'scenA' : scenarioA, 'scenB' : scenarioB});
	});
	
	it("duplicates should be detected", function() {
		var scenarioA = createTestScenario('scenA'),
			scenarioB = createTestScenario('scenB'),
			scenarioC = createTestScenario('scenA'),
			scenarios = [scenarioA, scenarioB, scenarioC];
			
		assert.deepEqual(preprocessor.getDuplicates(scenarios), {'scenA' : 2});
	});
	
	it("error should be thrown if duplicate exists", function() {
		var scenarioA = createTestScenario('scenA'),
			scenarioB = createTestScenario('scenB'),
			scenarioC = createTestScenario('scenA'),
			scenarios = [scenarioA, scenarioB, scenarioC];
		
		assert.throws(function (){preprocessor.ensureNoDuplicates(scenarios)}, Error);
	});
	
	it("error should not be thrown if duplicate does not exist", function() {
		var scenarioA = createTestScenario('scenA'),
			scenarioB = createTestScenario('scenB'),
			scenarioC = createTestScenario('scenC'),
			scenarios = [scenarioA, scenarioB, scenarioC];
		
		assert.doesNotThrow(function (){preprocessor.ensureNoDuplicates(scenarios)});
	});
	
	
	it("dependency graph should be created", function() {
        var scenarioA = createTestScenarioWithSteps('A', 3, 1, 'B'),
            scenarioB = createTestScenarioWithSteps('B', 2, 1, 'C'),
            scenarioC = createTestScenarioWithSteps('C', 2, -1),
            scenarioD = createTestScenarioWithSteps('D', 1, -1),
            scenarios = [scenarioA, scenarioB, scenarioC, scenarioD];
        
        var graph = preprocessor.getDependencyGraph(scenarios);
        assert.deepEqual(graph.getTopoSort(), ['C','B','A']);
    });
	
	it("scenarios should be processed", function() {
		var scenarioA = createTestScenarioWithSteps('scenA', 3, 1, 'scenB'),
			scenarioB = createTestScenarioWithSteps('scenB', 2, 1, 'scenC'),
			scenarioC = createTestScenarioWithSteps('scenC', 2, -1),
			scenarios = [scenarioA, scenarioB, scenarioC];
		
		assert.deepEqual(preprocessor.process(scenarios), [
			{'title':'scenC','steps':[{'scenC_step_0':'val'},{'scenC_step_1':'val'}]},
		    {'title':'scenB','steps':[{'scenB_step_0':'val'},{'scenC_step_0':'val'},{'scenC_step_1':'val'}]},
		    {'title':'scenA','steps':[{'scenA_step_0':'val'},{'scenB_step_0':'val'},{'scenC_step_0':'val'},{'scenC_step_1':'val'},{'scenA_step_2':'val'}]}
		]);
	});
	
	it("only doable scenarios should be returned", function() {
			scenarioA = createTestScenarioWithSteps('scenA', 2, -1),
			scenarioB = createTestScenarioWithSteps('scenB', 2, -1),
			scenarios = [scenarioA, scenarioB];
		
		scenarioB.type = 'fragment';
			
		assert.deepEqual(preprocessor.process(scenarios), [
		    scenarioA
		]);
	});
	
	it("scenarios should be returned sorted by order", function() {
		scenarioA = createTestScenario('scenA'),
		scenarioB = createTestScenario('scenB'),
		scenarioC = createTestScenario('scenC'),
		scenarios = [scenarioA, scenarioB, scenarioC];
	
		scenarioA.order = 2;
		scenarioB.order = 1;
		
		assert.deepEqual(preprocessor.process(scenarios), [
            scenarioB,
            scenarioA,
            scenarioC
		]);
	});
});
