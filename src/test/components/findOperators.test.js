const codeMod = require('../../main/components/findOperators');
const parser = require('../../main/components/JSCodeshiftWrapper').parser;
const j = require('../../main/components/JSCodeshiftWrapper').j;
const fileUtils = require('../../main/utils/fileutils');
const testCaseFiles = ['./src/test/resources/example.js', './src/test/resources/example_2.js']

describe.each(testCaseFiles)(
    'detecting operators usage',
    (fileName) => {

        let ast;

        beforeEach(() => {
            ast = parser(fileUtils.readFileSync(fileName).trim());
        });

        describe('Check console output of operators # ', () => {
            it('should console the # of operator that was inserted', () => {
                let idUsageStats = codeMod.findOperators(ast, j, "scan");
                expect(idUsageStats).toBeGreaterThanOrEqual(4);
            })

            it('should console that file has not the identifier that was given', () => {
                let idUsageStats = codeMod.findOperators(ast, j, "pluck");
                expect(idUsageStats).toBe(0);
            })

            // for (let [indexOfChain, chain] of promiseChains.entries()) {
            //     let snapshotObject = { chainLength: chain.length(), location: { start: chain.startLocation(), end:chain.endLocation()}, source: j(chain.codeshiftChainNode).toSource()};
            //     expect(snapshotObject).toMatchSnapshot();
            // }
        });

    },
);