const { isNumber, isBoolean } = require('../../utils/typeUtils');
const { SelectNode, RawNode } = require('../nodes');
const { parseAliasable } = require('./parseAliasable');

function parseSelect(args, opts) {
  // Special case for `select(nonStringPrimitive)`.
  if (args.length === 1 && (isNumber(args[0]) || isBoolean(args[0]))) {
    return [RawNode.create(args[0].toString(), [])];
  }

  return parseAliasable(args, Object.assign({}, opts, { NodeClass: SelectNode }));
}

module.exports = {
  parseSelect
};
