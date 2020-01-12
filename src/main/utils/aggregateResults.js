let csvModule = require('./exportToCsv');

module.exports = {
    aggregateCalc: (filesArray, csvRows, aggregateType) => {
        Array.prototype.push.apply(csvRows.rows, showOperatorsUsed);
        //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
        if (index == (filesArray.length - 1)) {

            converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
                prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
            });

            //iterate into csvRows in order to console log specific results.
            let tempConsoleArray = csvRows.rows
            // let observableResults = tempConsoleArray;
            let res = alasql(`SELECT subjectVar, SUM(subjectCalled) AS subjectCalled FROM ? GROUP BY subjectVar`, [tempConsoleArray]);
            res.shift();
            // console.log(res);
        }
    }
};
