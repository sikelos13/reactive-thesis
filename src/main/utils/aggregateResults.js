const alasql = require('alasql');
const util = require('util')
module.exports = {
    aggregateCalc: (nonAggregatedResults, showResultsInConsole) => {
        nonAggregatedResults = nonAggregatedResults.filter(obj => {
            return obj.fileName !== 'Filename';
        });
        if ( showResultsInConsole === "yes") {
            let res = alasql('SELECT name,fileName, SUM(timesUsed) AS timesUsed FROM ? GROUP BY name,fileName', [nonAggregatedResults]);
            console.log(util.inspect(res, { maxArrayLength: null }))
            return res;
        } else if (showResultsInConsole === "no") {
            let res = alasql('SELECT name,fileName, SUM(timesUsed) AS timesUsed FROM ? GROUP BY name,fileName', [nonAggregatedResults]);
            return res;
        }

    }
};
