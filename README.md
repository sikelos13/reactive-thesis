## Reactive programming for web applications

This is internal script made for the thesis project based on reactive programming.

## Getting Started

This is a simple scripting tool. Download the repository and npm install the dev dependencies from package.json.

## Scripts

```
$ node src/main/index.js"
```

## How it Works

Type node src/main/index.js <option> in order to run the script of your choice.
Three available options:

```
'-f, || --findOperator <name>', 'find the use of a specific rxjs operator'
'-o, || --operatorsInUse <source>', 'find all operators of rxjs library that are used in the file'

source must start from the root directory of the machine. i.e  in Mac OS is Users/{username}/directory of your directory with the files that need to be parsed.
```

## Instructions

```
Clone the repository.
Npm install inside the folder.
Run your preferable script.
```

## How We built the Scripting/Parsing Tool.

We worked on plain javascript ,gulp.js and node.js . For the parsing we use jscodeshift in order to develope the codemods of our choice. We use babel presets and babel cli in order to execute terminal commands within our js files

## License

Copyright © 2019, Stefanos Athanasoulias. Released under AUEB License.
