const { WhereNode } = require('../nodes');
const { parseFilter } = require('./parseFilter');

function parseWhere(args, opts) {
  return parseFilter(args, Object.assign({}, opts, { NodeClass: WhereNode }));
}

module.exports = {
  parseWhere
};
