const { InsertNode } = require('../nodes');
const { parseIdValueObject } = require('./parseObject');

function parseInsert(args, opts) {
  if (Array.isArray(args[0])) {
    return InsertNode.create(args[0].map(it => parseIdValueObject(it, opts)));
  } else {
    return InsertNode.create([parseIdValueObject(args[0], opts)]);
  }
}

module.exports = {
  parseInsert
};
