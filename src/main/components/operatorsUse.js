let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
const alasql = require('alasql');
let csvDate = new Date();
let dateOfCsv = csvDate.toLocaleDateString('en-GB').replace(/\//g, "-");

/**
 * Rename to operatorsUse
 * Receives as input the src of the files to be scanned
 * returns the object with the operator, its usage and the file we had found it. 
 * 
 * Object 
 * 
 * { operator: operator,
 *    count: <number>
 *    file: <path of file>
 * }
 */
myModule.operatorsUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsCalls = root.find(j.Identifier)
    let importedCalled = [];
    let showOperatorsUsed = [];
    let count = 0;
    let operatorObject = {}
    let importedOperators = [];
    let source = "";
    //Find how many identifiers we import from the rxjs library
    rxjsCalls.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration") {
            source = p.parentPath.parentPath.node.source.value
            if ((source.includes("rxjs")) && (!importedCalled.includes(p.node.name))) {
                importedCalled.push(p.node.name)
            }
            if ((source.includes("rxjs/operators")) && (!importedOperators.includes(p.node.name))) {
                importedOperators.push(p.node.name)
            }
        }
    })
    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        showOperatorsUsed.push({
            operatorName: "Operator",
            operatorCalled: "Times Used",
            file: "Found in file:"
        })
    }

    //iterate the imported identifiers  and scan files for operators
    try {
        fs.readFile(dir, (err, data) => {
            if (err) throw err;
            importedOperators.forEach(operator => {
                count = data.toString().split(operator).length - 1
                if (data.includes(operator)) {
                    showOperatorsUsed.push({
                        operatorName: operator,
                        operatorCalled: count,
                        file: dir
                    })
                }
            })
            // console.log("Operators found in " + dir + " ");

            //Push the array of objects for csv export 
            Array.prototype.push.apply(csvRows.rows, showOperatorsUsed);

            //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
            if (index == (filesArray.length - 1)) {
                converter.json2csv(csvRows.rows, json2csvCallback, {
                    prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
                });

                //iterate into csvRows in order to console log specific results.
                let tempConsoleArray = csvRows.rows
                let res = alasql('SELECT operatorName, SUM(operatorCalled) AS operatorCalled FROM ? GROUP BY operatorName', [tempConsoleArray]);
                res.shift();
                console.log(res);
            }
        });
    } catch (err) {
        console.log(err)
    }

    if (importedCalled.length > 0) {
        console.log(`File has imported : ` + importedCalled.length + "  rxjs items.");
    } else {
        console.log("File doesn't not include  rxjs calls")
    }
    //Json to csv function
    let json2csvCallback = function (err, csv) {
        if (err) throw err;
        fs.writeFile(`./csv_results/operatorsInUse-${dateOfCsv}.csv`, csv, function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted file saved.');
            } else {
                console.log(`operatorsInUse-${dateOfCsv}.csv Saved!`);
            }
        })
    };

};

module.exports = myModule;