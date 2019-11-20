const csvModule = require('../utils/jsonToCsv');
let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
const alasql = require('alasql');

function containsWord(str, word) {
    return str.match(new RegExp("\\b" + word + "\\b")) != null;
}

myModule.observablesInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsCalls = root.find(j.Identifier)
    let importedCalled = [];
    let showObservableUsed = [];
    let count = 1;
    let source = "";
    let matchesObservable = []
    let tempObservableCalled = 0;

    //Find how many identifiers we import from the rxjs library
    rxjsCalls.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration") {
            source = p.parentPath.parentPath.node.source.value
            if ((source.includes("rxjs")) && (!importedCalled.includes(p.node.name))) { 
                if (p.node.name == "Observable") {
                    importedCalled.push(p.node.name)
                }
            }
        }
    })
    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        showObservableUsed.push({
            observableVar: "Observable variable",
            observableCalled: "Times Used",
            file: "Found in file:"
        })
    }

    //iterate the imported identifiers  and scan files for operators
    try {
        fs.readFile(dir, (err, data) => {
            if (err) throw err;
            let tempData = data.toString().replace("\r\n", "    ");
            let arr = tempData.split(/\r?\n/) //white spaces must match length of string
            arr.forEach(line => {
                if (containsWord(line, "Observable") && containsWord(line, "new") && containsWord(line, "const")) {
                        let indexOfConst = line.indexOf("const");
                        let indexOfEqual = line.indexOf("=")
                        let tempVariable = line.slice((indexOfConst + 5), indexOfEqual).trim();
                        matchesObservable.push(tempVariable);
                } else if (containsWord(line, "Observable") && containsWord(line, "new") && containsWord(line, "return")) {
                    let tempVariable = "Observable";
                    matchesObservable.push(tempVariable);
                }
                // else if (containsWord(line, "Observable") && !containsWord(line, "import") && !containsWord(line, "//")) {
                //     tempObservableCalled++
                // }
            });
         
            matchesObservable.map(observable => {
                count = data.toString().split(observable).length - 1
                if (data.includes(observable)) {
                    if(observable == "Observable") {
                        showObservableUsed.push({
                            observableVar: "Observable_without_variable",
                            observableCalled: count - 1,
                            file: dir
                        })
                    } else {
                        showObservableUsed.push({
                            observableVar: observable,
                            observableCalled: count - 1,
                            file: dir
                        })
                    }
                }
            })
            // if(showObservableUsed.length < 2) {
            //     showObservableUsed.push({
            //         observableVar: "Observable_Constructor",
            //         observableCalled: tempObservableCalled,
            //         file: dir
            //     })
            // } 
            //Push the array of objects for csv export 
            Array.prototype.push.apply(csvRows.rows, showObservableUsed);

            //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
            if (index == (filesArray.length - 1)) {
                
                converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
                    prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
                });

                //iterate into csvRows in order to console log specific results.
                let tempConsoleArray = csvRows.rows
                let res = alasql('SELECT observableVar, SUM(observableCalled) AS observableCalled FROM ? GROUP BY observableVar', [tempConsoleArray]);
                res.shift();
                console.log(res);
            }
        });
        function changeDesc( value, desc ) {
            for (var i in showObservableUsed) {
              if (showObservableUsed[i].value == value) {
                showObservableUsed[i].desc = desc;
                 break; //Stop this loop, we found it!
              }
            }
         }
    } catch (err) {
        console.log(err)
    }

    if (importedCalled.length > 0) {
        console.log(`File has imported : ` + importedCalled.length + "  observable constructor.");
    } else {
        console.log("File doesn't not include  rxjs observables constructors")
    }

};

module.exports = myModule;