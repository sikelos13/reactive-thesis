const jscodeshift = require('jscodeshift');

class JSCodeshiftWrapper {

    static parse(code) {
        return jscodeshift(code, {
            flow: true
        });
    }
}

module.exports = Object.freeze({
    j: jscodeshift,
    parser: JSCodeshiftWrapper.parse
});