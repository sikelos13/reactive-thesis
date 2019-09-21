const {
    Parser
} = require("acorn")

let path = require('path'),
    fs = require('fs'),
    readFileSync = require('fs');

function processFile(data) {
    console.log(data);
}

function fromDir(startPath, filter) {

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    let files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            console.log('-- found js file: ', filename);
            // let fileToBeUsed = fs.readdirSync(filename);
            // const ast = Parser.parse(fileToBeUsed.toString())
            // fs.readFile(`${filename}`, function (err, data) {
            //     console.log(data)
            // })
        };
    };
    console.log(files);

};

fromDir('../thesis-projects-container', 'js');