let fs = require('fs');
var csvModule = {};
let csvDate = new Date();
let dateOfCsv = csvDate.toLocaleDateString('en-GB', {
    hour: "2-digit",
    minute: "2-digit",
}).replace(/\/|,|\s|:/g, "-");
let name = Math.random().toString(36).substring(7);

//Json to csv function
csvModule.json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile(`./csv_results/${name}-${dateOfCsv}.csv`, csv, function (err) {
        if (err) {
            console.log('Some error occurred - file either not saved or corrupted file saved.');
        } else {
            console.log(`${name}-${dateOfCsv}.csv Saved!`);
        }
    })
};

module.exports = csvModule;