'use strict';

var
	_  		  = require('lodash-node'),
    yaml      = require('js-yaml'),
    fs        = require('fs'),
    glob	  = require('glob'),
    Q 		  = require('q');

function scenarioLoader(scenarioPath) {
	var deferred = Q.defer();
	
	if(fs.statSync(scenarioPath).isFile()){
		deferred.resolve(readYaml(scenarioPath));
	}
	
	glob(scenarioPath + "**/*.yaml", function (er, filePaths) {
		var docs = [];
		_.each(filePaths, function(filePath){
			docs = docs.concat(readYaml(filePath));
		});
	  
		return deferred.resolve(docs);
	});

    return deferred.promise;
};

function readYaml(filePath){
	var docs = [];
	try {
        yaml.safeLoadAll(fs.readFileSync(filePath, 'utf8'), function(doc) {
            docs.push(doc);
        });
        
        return docs;
    } catch (e) {
        console.log('File', filePath, 'could not be loaded.');
        throw e;
    }
}

module.exports = scenarioLoader;