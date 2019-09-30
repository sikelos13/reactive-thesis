let path = require('path'),
    fs = require('fs');
const jscodeshift = require('jscodeshift');


function fromDir(startPath, filter) {
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

//            sh(`jscodeshift ${filename} -t ../reactive-thesis/src/components/subAnalyzer.js -dp -v 2 --parser flow`);
//            sh(`jscodeshift ${filename} -t ../reactive-thesis/src/components/pipeAnalyzer.js -dp -v 2 --parser flow`);


            //TODO: user should import his own src 
            // Project should only read one repo at a time.
            //TODO : implement Jscodeshift to wrap parser and read the js/ts files
            //TODO:  break  app.js into two functions ...{analyze.js file and main file in which we will iterate the directory with js/ts}
            //TODO: Implement
            //TODO :  Flow parser
            //TODO: yeoman for structure

        };
    };
    console.log(files);
};

fromDir('../test/resources/example.js', '.js');

// fromDir('../thesis-projects-container', 'js');
// readline.question(`What's  your files directory?`, file => {
//     readline.question(`What' type of files should we search?`, type => {
//         fromDir(file, type)
//         readline.close()
//     })
//     // readline.close()
// })