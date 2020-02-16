## Reactive programming for web applications

This is internal script made for the thesis project based on reactive programming. Its purpose is to iterate and analyze all .js/.ts/.tsx/.jsx files in order to find and export a variety of results based on rxjs library.

## Getting Started

This is a simple scripting tool. Download the repository and npm install the dev dependencies from package.json.

## Scripts

```
Run:

$ node src/main/index.js <option>

Test with:

$ npm test
```

## How it Works

Type node src/main/index.js <option> in order to run the script of your choice.
Current available options:

```
-'o, || --operatorsInUse <directory>', 'find all operators of rxjs library that are used in the file and export them in csv file'
-'s, || --subjectInUse <directory>', 'find all subject constructors and its variables of rxjs library that are used in the file and export them into csv file'
-'v, || --observablesInUse <directory>', 'find all observable constructors and its variables of rxjs library that are used in the file and export them into csv file'
-'p, || --pipelinesUsage <source> <action>', 'find the pipelines that have been used in your codebase'
```
## Actions:
Actions can be inserted inline with the preferable option.Currently we have two actions available.

    1. Export to csv action. In order to use the action you just have to add "e" at the end of the command line"
        i.e "node src/main/index.js -p Users/admin/thesis-examples e"
    2. Aggregate results action. In order to use the action you just have to add "a" and after the "a" input user have to enter if he wants to show or not the aggregate results in the console at the end of the command line". 
        For showing results user can enter "yes" or "no" after the action character.
        i.e "node src/main/index.js -p Users/admin/thesis-examples a yes/no"

## Disclaimer:
* Aggregation process applies only on the latest results from the previous process.
* Folder directory must start from the root directory of the machine. i.e in Mac OS is Users/{username}/directory of your directory with the files that need to be parsed.
* Export to csv will always  point to the root of 
* In order for _--exportToCsv--_ option to work out , you have to pre-create an **csv_results** folder inside the root directory of the repository.

## Instructions

```
Clone the repository.
Npm install inside the folder.
Run your script with preferable option.
Make 'csv_results'  folder in root directory.
```

## How We built the Scripting/Parsing Tool.

We worked on plain javascript ,gulp.js and node.js .For handling terminal options we use commander.js and for the parsing we use jscodeshift in which we wrap codemods with typescript parser. We use babel presets and babel cli in order to execute terminal commands within our js files. Rest of the packages that used in order to make our script work can be found in our package.json file.

## License

Copyright © 2019, Stefanos Athanasoulias. Released under AUEB License.
