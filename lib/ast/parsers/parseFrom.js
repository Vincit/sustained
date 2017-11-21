const { FromNode } = require('../nodes');
const { parseAliasableItems } = require('./parseAliasableItems');

function parseFrom(args, opts = {}) {
  return parseAliasableItems(args, Object.assign({}, opts, { NodeClass: FromNode }));
}

module.exports = {
  parseFrom
};
