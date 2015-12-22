var  _  = require('lodash-node'),
    parseArgs = require('minimist'),
    ScenarioExecutor = require('./lib/scenario-executor.js');

var defaultOptions = {
    'scenarioPath' : './scenarios/',
    'reportPath' : './scenario-report.json',
    'resolution' : '800x600',
    'takeScreenshots' : 'ON_FAILURE',
    'browserName' : 'firefox',
    'screenshotPath' : './'
};

var knownArgs = [
    'scenarioPath',
    'reportPath',
    'browserName',
    'takeScreenshots',
    'resolution',
    'screenshotPath'
];

var options = getOptions(); 

var scenarioExecutor = new ScenarioExecutor(options);

scenarioExecutor.run(options.scenarioPath, options.reportPath);

function getOptions(){
    var argv = parseArgs(process.argv.slice(2)),
        options = _.defaultsDeep(_.pick(argv, knownArgs), defaultOptions);
    
    return options;
}
