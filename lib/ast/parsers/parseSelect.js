const { isNumber, isBoolean } = require('../../utils/typeUtils');
const { SelectNode, ValueNode } = require('../nodes');
const { parseAliasableItems } = require('./parseAliasableItems');

function parseSelect(args, opts) {
  // Special case for `select(nonStringPrimitive)`.
  if (args.length === 1 && (isNumber(args[0]) || isBoolean(args[0]))) {
    return [ValueNode.create(args[0])];
  }

  return parseAliasableItems(args, Object.assign({}, opts, { NodeClass: SelectNode }));
}

module.exports = {
  parseSelect
};
