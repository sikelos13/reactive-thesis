## Reactive programming for web applications

This is internal script made for the thesis project based on reactive programming.

## Getting Started

This is a simple scripting tool. Download the repository and npm install the dev dependencies from package.json.

## Scripts

- npm start
- jscodeshift [file-path] -t [codmod-path]/[subAnalyzer.js / pipeAnalyzer.js] -dp -v 2 --parser flow

## How it Works

Type npm run-script <script_name> in order to run the script of your choice. First we run the npm start script and we type as input our directory of choice. Then we run the two custom-made codemods to analyze the files in order to find how many times pipe and subscriber used inside the code.

## Instructions

- Make an external src folder in which you will save your js/ts files.
- npm start in your terminal.
- Type the directory of your choice at npm start
- [optional] you can run [ntl] in order to see the available scripts to run
- from npm start find your file/files path
- run jscodeshift [file-path] -t [codmod-path]/[subAnalyzer.js / pipeAnalyzer.js] -dp -v 2 --parser flow

## How I built the Scripting/Parsing Tool.

I worked on plain javascript ,gulp.js and node.js . For the parsing we use jscodeshift in order to develope the codemods of our choice.

## License

Copyright © 2019, Stefanos Athanasoulias. Released under AUEB License.
