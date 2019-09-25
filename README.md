## Reactive programming for web applications

This is internal script made for the thesis project based on reactive programming.

## Getting Started

This is a simple scripting tool. Download the repository and npm install the dev dependencies from package.json.

## Scripts

*start
*sub-analyze
\*pipe-analyze

## How it Works

Type npm run-script <script_name> in order to run the script of your choice. First we run the npm start script and we type as input our directory of choice. Then we run the two custom-made codemods to analyze the files in order to find how many times pipe and subscriber used inside the code.

## Instructions

- Make an external src folder in which you will save your js/ts files.
- Type the directory of your choice at npm start
- npm start in your terminal.
  -npm <script_name> to analyze your files.

## How I built the Scripting/Parsing Tool.

I worked on plain javascript ,gulp.js and node.js . For the parsing we use jscodeshift in order to develope the codemods of our choice.

## License

Copyright © 2018, Stefanos Athanasoulias.Released under AUEB License.
