const pipeAnalyzer = require('../../main/components/pipeAnalyzer');
const parser = require('../../main/components/JSCodeshiftWrapper').parser;
const j = require('../../main/components/JSCodeshiftWrapper').j;
const fileUtils = require('../../main/utils/fileutils');
const testCaseFiles = ['./src/test/resources/example.js']

describe.each(testCaseFiles)(
    'detecting pipe calls',
    (fileName) => {

        let ast;
    
        beforeEach(() => {
            ast = parser(fileUtils.readFileSync(fileName).trim());
        });

        test('promise length and location in chain#', () => {
            var opsUsageStats = pipeAnalyzer.codeModPipe(ast, j);
            expect(opsUsageStats['scan']).toBe(2);

            // for (let [indexOfChain, chain] of promiseChains.entries()) {
            //     let snapshotObject = { chainLength: chain.length(), location: { start: chain.startLocation(), end:chain.endLocation()}, source: j(chain.codeshiftChainNode).toSource()};
            //     expect(snapshotObject).toMatchSnapshot();
            // }
        });

    },
);
