const { FromNode } = require('../nodes');
const { parseAliasableItems } = require('./parseAliasableItems');
const { isPlainObject } = require('../../utils/typeUtils');

const FROM_OPTIONS = ['only'];

function parseFrom(argsIn, opts) {
  const [args, options] = splitOptions(argsIn);
  const nodes = parseAliasableItems(args, Object.assign({}, opts, { NodeClass: FromNode }));

  if (options) {
    nodes.forEach(node => {
      Object.keys(options).forEach(key => {
        node[key] = options[key];
      });
    });
  }

  return nodes;
}

function splitOptions(args) {
  if (args.length > 1 && isOptionsObject(args[args.length - 1])) {
    return [args.slice(0, args.length - 1), args[args.length - 1]];
  } else {
    return [args, null];
  }
}

function isOptionsObject(obj) {
  return isPlainObject(obj) && Object.keys(obj).every(key => FROM_OPTIONS.includes(key));
}

module.exports = {
  parseFrom
};
