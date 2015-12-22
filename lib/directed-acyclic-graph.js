'use strict';

var
	_  = require('lodash-node');

function DirectedAcyclicGraph(){
	this.nodes = {};
}

DirectedAcyclicGraph.prototype.getTopoSort = function(){
	return getTopoSort(this.nodes);
};

DirectedAcyclicGraph.prototype.add = function(sourceName, targetName){
	var sourceNode = this.getOrCreate(sourceName),
		targetNode = this.getOrCreate(targetName);
	
	sourceNode.addSubsequentNode(targetNode);
	return this;
};

DirectedAcyclicGraph.prototype.getOrCreate = function(name){
	var node = this.nodes[name];
	if(!node){
		node = new Node(name);
		this.nodes[name] = node;
	}
	return node;
};

function getTopoSort(nodes){
	var topoSort = [],
		unmarkedNode;
	while ((unmarkedNode = findUnmarkedNode(nodes)) != null) {
		visit(unmarkedNode, topoSort);
	}
	return topoSort;
}

function findUnmarkedNode(nodes){
	return _.find(nodes, function(node, name){
		return node.markedPermanently == false;
	});
}

function visit(node, topoSort){
	if(node.markedTemporary){
		throw new Error('Graph has a cycle!');
	}
	if(!node.markedPermanently){
		node.markedTemporary = true;
		_.each(node.subsequentNodes, function(subsequentNode){
			visit(subsequentNode, topoSort);
		});
		node.markedPermanently = true;
		node.markedTemporary = false;
		
		topoSort.unshift(node.name);
	}
}

function Node(name){
	this.name = name;
	this.markedTemporary = false;
	this.markedPermanently = false;
	this.subsequentNodes = [];
	this.precedingNodes = [];
}

Node.prototype.addSubsequentNode = function(node){
	this.subsequentNodes.push(node);
	node.precedingNodes.push(this);
};

module.exports = DirectedAcyclicGraph;