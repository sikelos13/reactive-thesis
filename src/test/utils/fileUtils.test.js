const codeMod = require('../../main/components/findOperators');
const parser = require('../../main/components/JSCodeshiftWrapper').parser;
const j = require('../../main/components/JSCodeshiftWrapper').j;
const fileUtils = require('../../main/utils/fileutils');
const testCaseDirectory = ['./src/test/resources']

describe.each(testCaseDirectory)(
    'Reading specific filetypes',
    (path) => {

        let filesArray;

        beforeEach(() => {
            filesArray = fileUtils.getJSFilesSync(path);
        });

        expect.extend({
            toContainExtension(path) {
                console.log(path)
                let pass = false;
                const fileExtensions = ['js', 'tsx'];
                fileExtensions.forEach(fileExtension => {
                    pass = path.indexOf(fileExtensions[fileExtensions.length] != -1);
                })
                if (pass) {
                    return {
                        message: () =>
                            `expected file extension to be found`,
                        pass: true,
                    };
                } else {
                    return {
                        message: () => `expected file extension to be not found`,
                        pass: false,
                    };
                }
            },
        });

        describe('Read specific file types ', () => {
            test('should find only the files with filetype of .js.ts.tsx.jsx ', () => {

                filesArray.forEach(element => {
                    expect(element).toContainExtension();
                });
            })
        });

    },
);