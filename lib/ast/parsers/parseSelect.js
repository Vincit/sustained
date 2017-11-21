const { SelectNode } = require('../nodes');
const { parseAliasableItems } = require('./parseAliasableItems');

function parseSelect(args) {
  return parseAliasableItems(args, { NodeClass: SelectNode });
}

module.exports = {
  parseSelect
};
