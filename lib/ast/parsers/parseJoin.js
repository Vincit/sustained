const { JoinNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { isFunction, isAstBuilder } = require('../../utils/typeUtils');

function parseJoin(args, opts) {
  if (args.length === 1 && isAstBuilder(args[0])) {
    return [args[0].ast];
  }

  let joinBuilder = opts.queryBuilderClass.JoinBuilder.create({
    joinType: opts.joinType,
    target: parseIdentifier(args[0]),
    subQueryBuilderClass: opts.subQueryBuilderClass
  });

  if (args.length === 2 && isFunction(args[1])) {
    joinBuilder = args[1].call(joinBuilder, joinBuilder) || joinBuilder;
  } else if (args.length >= 2) {
    joinBuilder.on(...args.slice(1));
  }

  return [joinBuilder.ast];
}

module.exports = {
  parseJoin
};
