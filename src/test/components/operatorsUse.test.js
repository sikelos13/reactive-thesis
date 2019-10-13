const codeMod = require('../../main/components/operatorsUse');
const parser = require('../../main/components/JSCodeshiftWrapper').parser;
const j = require('../../main/components/JSCodeshiftWrapper').j;
const fileUtils = require('../../main/utils/fileutils');
const testCaseFiles = ['./src/test/resources/example.js', './src/test/resources/example_2.js']
let path = require('path'),
    fs = require('fs');

describe.each(testCaseFiles)(
    'detecting operators usage and print them in csv file',
    (fileName) => {
        let file = fileName.replace(/^.*[\\\/]/, '')

        let ast;

        beforeEach(() => {
            ast = parser(fileUtils.readFileSync(fileName).trim());
        });

        describe('Console output of operators usage ', () => {
            it('should console an array of objects of operators usage', () => {
                let operatorsUsage = codeMod.operatorsUse(ast, j, fileName, file);
                expect.arrayContaining(operatorsUsage);
            })

            // it('should export csv files for each of the files that where scanned', () => {
            //     let files = fileUtils.getJSFilesSync(path)
            //     // console.log(files);
            //     // let exportToCsv = codeMod.operatorsUse(ast, j, file, filename);
            //     // expect(idUsageStats).toBe(0);
            // })
        });

    },
);