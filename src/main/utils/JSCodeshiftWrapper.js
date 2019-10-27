const jscodeshift = require('jscodeshift');
const flowParser = require('flow-parser');

class JSCodeshiftWrapper {

    static parse(code) {
        return jscodeshift(code, {
            parser: flowParser
        });
    }
}

module.exports = Object.freeze({
    j: jscodeshift,
    parser: JSCodeshiftWrapper.parse
});