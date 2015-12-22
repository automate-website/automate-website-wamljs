var assert = require('assert'),
	DirectedAcyclicGraph = require('../lib/directed-acyclic-graph.js');

describe("DirectedAcyclicGraph", function(){
	it("topological sort is returned", function() {
		var graph = new DirectedAcyclicGraph();
			graph
				// a -> b -> c -> d
				//		  -> e -> f
				//			 e -> d
				.add('a', 'b')
				.add('b', 'c')
				.add('b', 'e')
				.add('c', 'd')
				.add('e', 'f')
				.add('e', 'd')
				// g -> h -> i
				.add('g', 'h')
				.add('h', 'i');
		
			assert.deepEqual(graph.getTopoSort(), [ 'g', 'h', 'i', 'a', 'b', 'e', 'f', 'c', 'd' ]);
	});
	
	it("error is thrown when trying to get the topological sort for a cyclic graph", function() {
		var graph = new DirectedAcyclicGraph();
			graph
				// a -> b -> c -> d
				//		  -> e -> f
				//			 e -> d
				.add('a', 'b')
				.add('b', 'c')
				.add('b', 'e')
				.add('c', 'd')
				.add('e', 'f')
				.add('e', 'd')
				.add('d', 'a')
				// g -> h -> i
				.add('g', 'h')
				.add('h', 'i');
		
			assert.throws(function (){graph.getTopoSort()}, Error);
	});
});
