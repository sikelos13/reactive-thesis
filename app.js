var path = require('path'),
    fs = require('fs');

function processFile(data) {
    console.log(data);
}

function fromDir(startPath, filter) {

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        // fs.readFile(`/${files[10]}`, function (err, data) {
        //     // if (err) {
        //     //     throw err;
        //     // }

        //     // Invoke the next step here however you like
        //     // console.log(content); // Put all of the code here (not the best solution)
        //     processFile(data); // Or put the next step in a function and invoke it
        // });
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            console.log('-- found js file: ', filename);
            // fs.readFile(`${filename}`, function (err, data) {
            //     console.log(data)
            // })
        };
    };
    console.log(files);

};

fromDir('../thesis-projects-container', 'js');