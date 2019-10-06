const fs = require('fs');
const path = require('path');
const glob = require('glob');
var walk = require('walk');

/**
 * Reads a directory recursively, looking for files with a specific extension
 * @param dirPath the directory to read from, relative to this file
 * @param callback the function to execute after read of files is completed
 */
exports.readDirectory = function readDirectory(dirPath, fileExt, callback) {
    let walker = walk.walk(dirPath, {
        followLinks: false
    });
    let files = [];
    walker.on('file', function (root, stat, next) {
        fs.readFile(path.join(root, stat.name), function (err, contents) {
            //tern normalizes all filenames with forward slashes, following the same convention below
            files.push({
                fileId: path.join(root, stat.name).replace(/\\/g, "/"),
                contents: contents
            });
            next();
        });
    });

    walker.on('end', function () {
        callback(files);
    });
}

exports.readFileSync = function readFileSync(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

exports.writeFileSync = function writeFileSync(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Reads files with js extension from the given directory
 * @param directory string representation of a directory
 * @returns {*}
 */
exports.getJSFilesSync = function getJSFiles(directory) {
    return glob.sync(directory + "**/*.{js,ts,jsx,tsx}");
}