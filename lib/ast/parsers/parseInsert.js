const { InsertNode } = require('../nodes');
const { parseIdValueObject } = require('./parseObject');
const { parseSubQueryCallback } = require('./parseCallback');
const { isAst, isFunction, isArray } = require('../../utils/typeUtils');
const { parseAst } = require('./parseAst');

function parseInsert(args, opts) {
  const arg = args[0];

  if (isArray(arg)) {
    return InsertNode.create(arg.map(it => parseArg(it, opts)));
  } else if (arg) {
    return InsertNode.create([parseArg(arg, opts)]);
  } else {
    return InsertNode.create([]);
  }
}

function parseArg(arg, opts) {
  if (isAst(arg)) {
    return parseAst(arg);
  } else if (isFunction(arg)) {
    return parseSubQueryCallback(arg, opts);
  } else {
    return parseIdValueObject(arg, opts);
  }
}

module.exports = {
  parseInsert
};
