const { FromNode } = require('../nodes');
const { parseAliasableItems } = require('./parseAliasableItems');

function parseFrom(args) {
  return parseAliasableItems(args, { NodeClass: FromNode });
}

module.exports = {
  parseFrom
};
