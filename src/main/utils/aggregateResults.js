let csvModule = require('./exportToCsv');
const alasql = require('alasql');

module.exports = {
    aggregateCalc: (nonAggregatedResults, aggregateType) => {

        nonAggregatedResults = nonAggregatedResults.filter(obj => {
            return obj.fileName !== 'Filename';
        });
        // console.log(nonAggregatedResults)
        if (aggregateType === "operators") {
            let res = alasql('SELECT name, SUM(timesUsed) AS timesUsed FROM ? GROUP BY name', [nonAggregatedResults]);
            console.log(res);
     
        }
        
    }
};
