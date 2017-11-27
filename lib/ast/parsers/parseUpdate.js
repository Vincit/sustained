const { UpdateNode } = require('../nodes');
const { parseIdValueObject } = require('./parseObject');

function parseUpdate(args, opts) {
  return UpdateNode.create(parseIdValueObject(args[0], opts));
}

module.exports = {
  parseUpdate
};
