let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
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
myModule.operatorsUse = function (root, j, dir, filename) {
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
    //Initialize array with columns titles
    showOperatorsUsed.push({
        operatorName: "Operator",
        operatorCalled: "Times Used",
        file: "Found in file:"
    })
    //iterate the imported identifiers  and scan files for operators
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
        console.log("Operators found in " + dir + " ");
        console.log(showOperatorsUsed);

        //Push the array of objects for csv export 
        operatorObject.rows = showOperatorsUsed

        converter.json2csv(operatorObject.rows, json2csvCallback, {
            prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
        });

    });

    if (importedCalled.length > 0) {
        console.log(`File has imported : ` + importedCalled.length + "  rxjs items.");
    } else {
        console.log("File doesn't not include  rxjs calls")
    }

    let json2csvCallback = function (err, csv) {
        if (err) throw err;
        fs.writeFile(`./csv_results/operatorsInUse-${dateOfCsv}-${filename}.csv`, csv, function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted file saved.');
            } else {
                console.log(`operatorsInUse-${dateOfCsv}-${filename}.csv Saved!`);
            }
        })
    };
    return showOperatorsUsed
};

module.exports = myModule;