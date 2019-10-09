let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');

//Initials for CSV file

/**
 * Rename to findOperators
 * Receives as input the ast of the file and
 * returns the number of occurrences for each operator 
 * 
 * Object 
 * 
 * { 'map': 2,
 *    'scan': 3
 * }
 */
myModule.operatorsUse = function (root, j, dir) {
    const rxjsCalls = root.find(j.Identifier)
    let importedCalled = [];
    let showOperatorsUsed = [];
    let count = 0;
    let operatorObject = {

    }
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
    //iterate the imported identifiers 
    fs.readFile(dir, (err, data) => {
        if (err) throw err;
        importedOperators.forEach(operator => {
            console.log(operator)
            count = data.toString().split(operator).length - 1
            if (data.includes(operator)) {
                showOperatorsUsed.push({
                    operatorName: operator,
                    operatorCalled: count,
                    file: dir
                })
            }
        })
        operatorObject.rows = showOperatorsUsed
        // writeFile(`./${dir[dir.length -8]}-test-data.csv`, showOperatorsUsed, (err) => {
        //     if (err) {
        //         console.log(err); // Do something to handle the error or just throw it
        //         throw new Error(err);
        //     }
        //     console.log('Success!');
        // });

        converter.json2csv(operatorObject.rows, json2csvCallback, {
            prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
        });
        console.log("Operators found in " + dir + " ")
        console.log(showOperatorsUsed)

    });

    if (importedCalled.length > 0) {
        console.log(`File has imported : ` + importedCalled.length + "  rxjs items.");

    } else {
        console.log("File doesn't not include  rxjs calls")
    }
    //Export to csv
    // showOperatorsUsed.forEach(operatorObject => {
    //     data.push({
    //         'file': operatorObject.fille,
    //         'name': operatorObject.operatorName,
    //         'usage': operatorObject.operatorCalled
    //     })

    let json2csvCallback = function (err, csv) {
        if (err) throw err;
        fs.writeFile('./name.csv', csv, function (err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                console.log('It\'s saved!');
            }
        });
    };
    return importedCalled
};

module.exports = myModule;

// json2csv - i test.json - f name, version > test.csv