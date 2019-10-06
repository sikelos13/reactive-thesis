## Reactive programming for web applications

This is internal script made for the thesis project based on reactive programming.

## Getting Started

This is a simple scripting tool. Download the repository and npm install the dev dependencies from package.json.

## Scripts
```
- node src/main/index.js"
```
## How it Works

Type node src/main/index.js <option> in order to run the script of your choice.
Three available options:

```
    #1.--operators <identifier_name> or -o <identifier_name> . This script will count how many times the identifier was used.
    #2. --ast or -a . Will output the ast tree of the file
```

## Instructions

```
-Clone the repository.
-Npm install inside the folder.
-Run your preferable script.
```

## How I built the Scripting/Parsing Tool.

I worked on plain javascript ,gulp.js and node.js . For the parsing we use jscodeshift in order to develope the codemods of our choice. We use babel presets and babel cli in order to execute terminal commands within our js files

## License

Copyright © 2019, Stefanos Athanasoulias. Released under AUEB License.
