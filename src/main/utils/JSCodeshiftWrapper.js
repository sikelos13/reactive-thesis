const jscodeshift = require('jscodeshift');
const flowParser = require('flow-parser');
const defaultOptions = {
    esproposal_class_instance_fields: true,
    esproposal_class_static_fields: true,
    esproposal_decorators: true,
    esproposal_export_star_as: true,
    esproposal_optional_chaining: true,
    esproposal_nullish_coalescing: true,
    tokens: true,
    types: true,
    plugins: ["jsx","flow"]
  };

class JSCodeshiftWrapper {

    static parse(code) {
        return jscodeshift(code, {
            parser: flowParser,
            defaultOptions
        });
    }
}

module.exports = Object.freeze({
    j: jscodeshift,
    parser: JSCodeshiftWrapper.parse
});