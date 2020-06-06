const fs = require('fs');
const resultFile = 'result.json'

var collectionCompleteCounter = 0
var totalCollections = 0
var tallyTestsTotal = 0
var tallyTestsFailed = 0
var tallyTestsPassed = 0
var tallyAssertionsTotal = 0
var tallyAssertionsFailed = 0
var tallyAssertionsPassed = 0
var testResultSummary = {}
testResultSummary['collectionResults'] = []

exports.clearPreviousResult = function clearPreviousResult() {
	testResultSummary['collectionResults'] = [];
	collectionCompleteCounter=0;
	if (fs.existsSync(resultFile)) {
		fs.unlinkSync(resultFile);
	}

}

exports.setCollectionCount = function setCollectionCount(count) {
	totalCollections = count;
}

function saveResult() {
	fs.writeFile(resultFile, JSON.stringify(testResultSummary), function (err) {
	  if (err) throw err;
	});
}

exports.processCollection = function resultOfNewmanRun(err, summary) {
    	var collectionResults = {}
      if (err) {
        errMsg = "Oops, newman run resulted in the following error: " + err.stack
        return callback(errMsg)
      } else {
    	  
    	  collectionResults.suiteName = summary.collection.name
        collectionResults.executionTimeTotal = (summary.run.timings.completed - summary.run.timings.started)
//        collectionResults.executionTimeTotalPrintable = time.millisecondsToReadableFormat(collectionResults.executionTimeTotal)
        collectionResults.responseTimeAverage = Math.round(summary.run.timings.responseAverage)

        //Tests stats
        collectionResults.testsTotal = summary.run.stats.tests.total
//        collectionResults.testsTotalPrintable = collectionResults.testsTotal.numberWithCommas()
        collectionResults.testsFailed = summary.run.stats.tests.failed
//        collectionResults.testsFailedPrintable = collectionResults.testsFailed.numberWithCommas()
//        collectionResults.testsPassed = (collectionResults.testsTotal - collectionResults.testsFailed)
//        collectionResults.testsPassedPrintable = collectionResults.testsPassed.numberWithCommas()

        //Assertions stats
        collectionResults.assertionsTotal = summary.run.stats.assertions.total
//        collectionResults.assertionsTotalPrintable = collectionResults.assertionsTotal.numberWithCommas()
        collectionResults.assertionsFailed = summary.run.stats.assertions.failed
//        collectionResults.assertionsFailedPrintable = collectionResults.assertionsFailed.numberWithCommas()
        collectionResults.assertionsPassed = (collectionResults.assertionsTotal - collectionResults.assertionsFailed)
//        collectionResults.assertionsPassedPrintable = collectionResults.assertionsPassed.numberWithCommas()

        if ( (collectionResults.assertionsFailed > 0) ) {
          collectionResults.result = 'failed'
        } else {
        	collectionResults.result = 'passed'
        }
	  processSuite(null, collectionResults)
  
      }
}
    
var processSuite = function resultOfrunPostmanCollection(errMsg, collectionResults) {
    if (errMsg) {
        return callback(errMsg)
      } else {
    	  collectionCompleteCounter++;
		if (collectionResults.result === 'failed') {
		  collectionFailCounter++
		}

        //Tally data from collectionResults for testResultSummary
        tallyTestsTotal += collectionResults.testsTotal
        tallyTestsFailed += collectionResults.testsFailed
        tallyTestsPassed += collectionResults.testsPassed
        tallyAssertionsTotal += collectionResults.assertionsTotal
        tallyAssertionsFailed += collectionResults.assertionsFailed
        tallyAssertionsPassed += collectionResults.assertionsPassed
        testResultSummary['collectionResults'].push(collectionResults)
        if(totalCollections == collectionCompleteCounter){
        	saveResult();
        }    
      }
    }