const { JoinOnNode } = require('../nodes');
const { parseFilter } = require('./parseFilter');

function parseOn(args, opts) {
  return parseFilter(args, Object.assign({}, opts, { NodeClass: JoinOnNode }));
}

module.exports = {
  parseOn
};
