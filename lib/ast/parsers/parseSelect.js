const { isNumber, isBoolean } = require('../../utils/typeUtils');
const { SelectNode, RawNode } = require('../nodes');
const { parseAliasable } = require('./parseAliasable');

function parseSelect(args, opts) {
  if (isPrimitive(args)) {
    // Special case for select(1), select(false) etc.
    return parsePrimitive(args);
  } else {
    return parseAliasable(args, Object.assign({}, opts, { NodeClass: SelectNode }));
  }
}

function isPrimitive(args) {
  return args.length === 1 && (isNumber(args[0]) || isBoolean(args[0]));
}

function parsePrimitive(args) {
  // knex quirk: Cannot use placeholders here.
  return [RawNode.create(`${args[0]}`, [])];
}

module.exports = {
  parseSelect
};
