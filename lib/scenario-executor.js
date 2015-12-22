var  _  = require('lodash-node'),
    webdriverio = require('webdriverio'), 
    events = require('events'),
    scenarioLoader = require('./scenario-loader.js'),
    Reporter = require('./reporter.js'),
    StepChainAugmentor = require('./step-chain-augmentor.js'),
    ScreenShooter = require('./screen-shooter.js'),
    scenarioPreprocessor = require('./scenario-preprocessor.js'),
    StepPreprocessor = require('./step-preprocessor.js'),
    Step = require('./step.js')
    ExpressionEvaluator = require('./expression-evaluator.js'),
    commandExtensions = require('./command-extensions.js');

var defaultWebdriverOptions = {
    desiredCapabilities : {
        browserName : 'chrome',
        acceptSslCerts : true
    }
};

var knownWebdriverOptions = ['desiredCapabilities'];

function ScenarioExecutor(options){
    var webdriverOptions = getWebdriverOptions(options);
    this.options = options;
    this.client = webdriverio.remote(webdriverOptions);
    commandExtensions.register(this.client);
}

ScenarioExecutor.prototype.run = function(scenarioPath, reportPath){
	var promise = this.client,
		options = this.options,
		reporter = new Reporter(reportPath);
	
	scenarioLoader(scenarioPath)
		.then(function(scenarios){
			scenarios = scenarioPreprocessor.process(scenarios);
			
			for (var docId in scenarios) {
		        var doc = scenarios[docId];

		        promise = executeScenario(options, promise, doc, reporter);
		    }
		})
		.done();
}

function executeScenario(options, promise, doc, reporter) {
    promise = promise.init();

    var screenShooter = new ScreenShooter(options),
        stepChainAugmentor = new StepChainAugmentor(options, screenShooter),
        scenarioReport = reporter.addScenario(doc, stepChainAugmentor),
        sessionId = stepChainAugmentor.sessionId,
        expressionEvaluator = new ExpressionEvaluator(),
        stepPreprocessor = new StepPreprocessor(expressionEvaluator);

    // Process resolution
    var resolution = getResolution(options, doc);
    console.log(resolution);
    promise = promise.setViewportSize({
        width : parseInt(resolution[0]),
        height : parseInt(resolution[1])
    });

    for ( var stepId in doc.steps) {
        var step = Step.ofRawStep(doc.steps[stepId]);
        
        promise = stepPreprocessor.process(promise, step);
        promise = stepChainAugmentor.augment(promise, step);
    }

    promise = stepChainAugmentor.augment(promise, Step.End);
    
    return promise.end();
}

function getResolution(options, doc){
    var docResolution = doc['resolution'],
        resolution = docResolution ? docResolution : options.resolution;
    return resolution.split('x');
}

function getWebdriverOptions(options){
   var result = _.merge(
        _.cloneDeep(defaultWebdriverOptions), 
        _.pick(options, knownWebdriverOptions)
   );
   _.merge(result.desiredCapabilities, _.pick(options, 'browserName'));
   return result;
}

module.exports = ScenarioExecutor;