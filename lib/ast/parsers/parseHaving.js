const { HavingNode } = require('../nodes');
const { parseFilter } = require('./parseFilter');

function parseHaving(args, opts) {
  return parseFilter(args, Object.assign({}, opts, { NodeClass: HavingNode }));
}

module.exports = {
  parseHaving
};