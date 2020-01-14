let csvModule = require('./exportToCsv');
const alasql = require('alasql');

module.exports = {
    aggregateCalc: (nonAggregatedResults, aggregateType) => {

        let res = [];
        nonAggregatedResults = nonAggregatedResults.filter(obj => {
            return obj.fileName !== 'Filename';
        });

        if (aggregateType === "operators") {
            res = alasql('SELECT name, SUM(timesUsed) AS timesUsed FROM ? GROUP BY name', [nonAggregatedResults]);
            // res.shift({...header, timesUsed: "Times used"})
            // res.shift();
            console.log(res);
        }
        
    }
};
