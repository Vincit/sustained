const { InsertNode } = require('../nodes');
const { parseIdValueObject } = require('./parseObject');
const { isAstNode, isAstBuilder } = require('../../utils/typeUtils');

function parseInsert(args, opts) {
  const arg = args[0];

  if (Array.isArray(arg)) {
    return InsertNode.create(arg.map(it => parseArg(it, opts)));
  } else if (arg) {
    return InsertNode.create([parseArg(arg, opts)]);
  } else {
    return InsertNode.create([]);
  }
}

function parseArg(arg, opts) {
  if (isAstNode(arg)) {
    return arg.clone();
  } else if (isAstBuilder(arg)) {
    return arg.ast.clone();
  } else {
    return parseIdValueObject(arg, opts);
  }
}

module.exports = {
  parseInsert
};
