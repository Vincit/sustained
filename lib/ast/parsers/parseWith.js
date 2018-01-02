const { WithNode } = require('../nodes');
const { parseValue } = require('./parseValue');
const { parseAlias } = require('./parseIdentifier');
const { isPlainObject } = require('../../utils/typeUtils');

function parseWith(args, opts) {
  if (args.length === 2) {
    return [WithNode.create(parseValue(args[1], opts), parseAlias(args[0], opts))];
  } else if (args.length === 1 && isPlainObject(args[0])) {
    return parseObject(args[0], opts);
  } else {
    throw new Error(`invalid WhereNode ${JSON.stringify(item)}`);
  }
}

function parseObject(value, opts) {
  return Object.keys(value).map(key => {
    const val = value[key];
    return WithNode.create(parseValue(val, opts), parseAlias(key, opts));
  });
}

module.exports = {
  parseWith
};
