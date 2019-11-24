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

myModule.subjectInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsCalls = root.find(j.Identifier)
    let importedCalled = [];
    let showSubjectUsed = [];
    let count = 0;
    let source = "";
    let matchesSubjects = []

    //Find how many identifiers we import from the rxjs library
    rxjsCalls.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration") {
            source = p.parentPath.parentPath.node.source.value
            if ((source.includes("rxjs")) && (!importedCalled.includes(p.node.name))) {
                if (p.node.name == "Subject") {
                    importedCalled.push(p.node.name)
                }
            }
            // if ((source.includes("rxjs/operators")) && (!importedOperators.includes(p.node.name))) {
            //     importedOperators.push(p.node.name)
            // }
        }
    })
    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        showSubjectUsed.push({
            subject: "Subject variable",
            subjectCalled: "Times Used",
            file: "Found in file:"
        })
    }

    //iterate the imported identifiers  and scan files for operators
    try {
        fs.readFile(dir, (err, data) => {
            if (err) throw err;
            // console.log(data.toString())
            let tempData = data.toString().replace("\r\n", "    ");
            let arr = tempData.split(/\r?\n/) //white spaces must match length of string
            let forEachCounter = 0;
            arr.forEach(line => {
                if (containsWord(line, "Subject")) {
                    if (forEachCounter > 0) {
                        let indexOfConst = line.indexOf("const");
                        let indexOfEqual = line.indexOf("=")
                        let tempVariable = line.slice((indexOfConst + 5), indexOfEqual).trim();
                        console.log(tempVariable)

                        matchesSubjects.push(tempVariable);
                    }
                    forEachCounter = +1;
                }
            });

            matchesSubjects.forEach(subject => {

                count = data.toString().split(subject).length - 1
                if (data.includes(subject)) {
                    showSubjectUsed.push({
                        subject: subject,
                        subjectCalled: count - 1,
                        file: dir
                    })
                }
            })
            // console.log("Operators found in " + dir + " ");

            //Push the array of objects for csv export 
            Array.prototype.push.apply(csvRows.rows, showSubjectUsed);

            //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
            if (index == (filesArray.length - 1)) {
                converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
                    prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
                });

                //iterate into csvRows in order to console log specific results.
                let tempConsoleArray = csvRows.rows
                let res = alasql('SELECT subject, SUM(subjectCalled) AS subjectCalled FROM ? GROUP BY subject', [tempConsoleArray]);
                res.shift();
                console.log(res);
            }
        });
    } catch (err) {
        console.log(err)
    }

    if (importedCalled.length > 0) {
        console.log(`File has imported : ` + importedCalled.length + "  subject observable.");
    } else {
        console.log("File doesn't not include  rxjs calls")
    }

};

module.exports = myModule;