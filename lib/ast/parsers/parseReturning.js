const { ReturningNode } = require('../nodes');
const { parseAliasable } = require('./parseAliasable');

function parseReturning(args, opts) {
  return parseAliasable(args, Object.assign({}, opts, { NodeClass: ReturningNode }));
}

module.exports = {
  parseReturning
};
