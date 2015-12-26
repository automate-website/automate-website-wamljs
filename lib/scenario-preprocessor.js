'use strict';

var _ = require('lodash-node'),
    DirectedAcyclicGraph = require('./directed-acyclic-graph.js');

var includeCommandAliases = ['includeScenario', 'include'],
	types = { fragment : 'fragment', doable : 'doable' },
	maxOrder = Number.MAX_VALUE;

var scenarioPreprocessor = {};

scenarioPreprocessor.process = function(scenarios, scenarioTitlePattern){
    scenarioPreprocessor.ensureNoDuplicates(scenarios);
	
	var resultScenarios;
	
	sortUsingDependencyGraph(scenarios, scenarioPreprocessor.getDependencyGraph(scenarios));
	
	resultScenarios = processIncludeSteps(scenarios);
	
	resultScenarios = filterDoables(resultScenarios);
	
	resultScenarios = filterByTitlePattern(resultScenarios, scenarioTitlePattern);
	
	sortByOrder(resultScenarios);
	
	return resultScenarios;
}

scenarioPreprocessor.getDependencyGraph = function(scenarios){
    var titleScenarioMap = scenarioPreprocessor.getTitleScenarioMap(scenarios),
    	graph = new DirectedAcyclicGraph();
    
    _.each(scenarios, function(scenario){
        _.each(scenario.steps, function(step){
            if(isIncludeStep(step)){
                var scenarioTitle = stepSimpleValueOf(step),
                    includedScenario = titleScenarioMap[scenarioTitle];
                
                if(!_.isObject(includedScenario)){
                    throw new Error('Included scenario with title "' + scenarioTitle + '" not found!');
                }
                
                graph.add(includedScenario.title, scenario.title);
            }
        });
    });
    
    return graph;
}

scenarioPreprocessor.ensureNoDuplicates = function(scenarios){
	var duplicates = scenarioPreprocessor.getDuplicates(scenarios);
	if(!_.isEmpty(duplicates)){
		throw new Error('Title should be unique and can not be used in multple scenarios. Affected title(s) is(are) ' + _.keys(duplicates));
	}
};


scenarioPreprocessor.getDuplicates = function(scenarios){
	return _.chain(scenarios)
		.countBy(function(scenario){
			return scenario.title;
		})
		.pick(function(value, key){
			return value > 1;
		})
		.value();
};

scenarioPreprocessor.getTitleScenarioMap = function(scenarios){
	return _.chain(scenarios)
		.map(function(scenario){
			var wrapper = {};
			wrapper[scenario.title] = scenario;
			return wrapper; 
		})
		.reduce(_.merge)
		.value();
};

function sortByOrder(scenarios){
	scenarios.sort(function(left, right){
		var leftOrder = left.order ? left.order: maxOrder,
			rightOrder = right.order ? right.order : maxOrder; 
		
		return leftOrder > rightOrder ? 
				1 : (leftOrder < rightOrder ? 
						-1 : 0);
	});
}

function filterDoables(scenarios){
	return _.filter(scenarios, function(scenario){
		var type = scenario.type;
		return _.isUndefined(type) || type === types.doable;
	});
}

function filterByTitlePattern(scenarios, titlePattern){
	var titlePatternExp = new RegExp(titlePattern);
	return _.filter(scenarios, function(scenario){
		var title = scenario.title;
		return title.match(titlePatternExp);
	});
}

function processIncludeSteps(scenarios){
	var titleScenarioMap = {};
	return _.chain(scenarios).each(function(scenario){
			scenario.steps = _.chain(scenario.steps)
			.map(function(step){
				if(isIncludeStep(step)){
					var scenarioTitle = stepSimpleValueOf(step),
						includedScenario = titleScenarioMap[scenarioTitle];
					return includedScenario.steps;
				} else {
					return step;
				}
			})
			.flatten()
			.compact()
			.value();
	    titleScenarioMap[scenario.title] = scenario;
	})
	.value();
}

function sortUsingDependencyGraph(scenarios, graph){
	var topoSort = graph.getTopoSort();
	scenarios.sort(function(leftScenario, rightScenario){
		return compare(leftScenario, rightScenario, topoSort);
	});
}

function compare(leftScenario, rightScenario, scenarioOrder){
	var leftIndex = _.indexOf(scenarioOrder, leftScenario.title),
		rightIndex = _.indexOf(scenarioOrder, rightScenario.title);
	
	if(leftIndex > rightIndex){
		return 1;
	} else if(leftIndex < rightIndex){
		return -1;
	}
	return 0;
}

function stepNameOf(step){
	return _.first(_.keys(step));
}

function stepSimpleValueOf(step){
	return _.first(_.values(step));
}

function isIncludeStep(step){
    return _.includes(includeCommandAliases, stepNameOf(step));
}

module.exports = scenarioPreprocessor;