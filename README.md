# WebRobotJS
The [web automation markup language] runner based on [webdriver.io].

Refer to the [changelog] for recent notable changes and modifications.

## Project Structure

```
	/lib			# scenario runner, processor, loader and supporting functions 
		/commands   # custom commands
	/scenarios		# test scenarios that are executed by default
	/test			# component tests
```

## Getting Started

### Prerequisites

* [nodejs]
* [firefox]

### First Run

* `$ npm install`
* `$ node index.js`

## Examples

By default [example] scenario is being executed when calling `$ node index.js`.

For complex examples refer to our [manager-user-acceptance-tests].

## Options

* `scenarioPath` `{String}` `./scenarios/` Path to a certain scenario file or base directory with scenarios that should be executed.

* `reportPath` `{String}` `./scenario-report.json` Path to the JSON report that is generated after the execution.

* `resolution` `{String}` `800x600` Screen resolution to run the browser with.

* `takeScreenshots` `{Enum: NEVER, ON_FAILURE, ON_EVERY_STEP}` `ON_FAILURE` Determines when screenshots should be taken.

* `browserName` `{String}` `firefox` Name of the browser to work with.

* `screenshotPath` `{String}` `./` Path to the directory where the screenshots should be placed to.

* `scenarioTitlePattern` `{String}` `.*` Regular expression that describes scenarios by title pattern to execute.

* `logLevel` `{Enum: OFF, FATAL, ERROR, WARN, INFO, DEBUG, TRACE, ALL}` `INFO` Defines the log level that is set to all loggers.

## Commands
In general all API methods provided by [webdriver.io] are supported. Please consult [webdriver.io API] for further information.

In addition following commands are supported:

### include(title)

* `title` `{String}` Title of a scenario to include

### anyOfElementsContainsText(selector, text)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements

### anyOfElementsContainsTextAndClick(selector, text)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements

### anyOfElementsContainsTextAndClickBasedOn(selector, text, basedOnSelector)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements
* `basedOnSelector` CSS selector used to identify a child element on identified elements

### anyOfElementsHasValue(selector, text)

* `selector` `{String}` CSS selector used to identify certain elements
* `value` `{String}` Value to be matched on the identified elements

### anyOfElementsVisible(selector)

* `selector` `{String}` CSS selector used to identify certain elements

### elementIdAndClickBasedOn(elementId, selector)

* `elementId` `{String}` Element identifier
* `selector` `{String}` CSS selector used to identify element to click on

### moveToAnyOfElementsContainsText(selector, text, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements
* `ms` `{Number}` Number of milliseconds to search for the desired element

### noneOfElementsContainsText(selector, text, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements

### waitUntilAnyOfElementsContainsText(selector, text, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements
* `ms` `{Number}` Number of milliseconds to search for the desired element

### waitUntilAnyOfElementsContainsTextAndClick(selector, text, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements
* `ms` `{Number}` Number of milliseconds to search for the desired element

### waitUntilAnyOfElementsContainsTextAndClickBasedOn(selector, text, basedOnSelector, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements
* `basedOnSelector` CSS selector used to identify a child element on identified elements
* `ms` `{Number}` Number of milliseconds to search for the desired element

### waitUntilAnyOfElementsHasValue(selector, value, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `value` `{String}` Value to be matched on the identified elements
* `ms` `{Number}` Number of milliseconds to search for the desired element

### waitUntilAnyOfElementsVisibleAndClick(selector, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `ms` `{Number}` Number of milliseconds to search for the desired element

### waitUntilNoneOfElementsContainsText(selector, text, ms)

* `selector` `{String}` CSS selector used to identify certain elements
* `text` `{String}` Text to be matched on the identified elements
* `ms` `{Number}` Number of milliseconds to search for the desired element



## Test Execution
Tests may be executed with the `mocha` framework that has to be installed first
        
    npm install -g mocha

To run all tests located in the `test` directory, execute
	
	mocha
	
To run specific tests by pattern execute

	mocha -g "<test name pattern>"



[changelog]: CHANGELOG.md
[webdriver.io]: http://webdriver.io
[webdriver.io API]: http://webdriver.io/api.html
[web automation markup language]: https://github.com/automate-website/web-automation-markup-language
[nodejs]: https://nodejs.org
[firefox]: https://www.mozilla.org/de/firefox/new/
[example]: scenarios/example.yaml
[manager-user-acceptance-tests]: https://github.com/automate-website/manager-user-acceptance-tests