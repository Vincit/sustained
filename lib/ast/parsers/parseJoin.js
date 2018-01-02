const { JoinNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { isFunction, isAst } = require('../../utils/typeUtils');
const { parseAst } = require('./parseAst');

function parseJoin(args, opts) {
  if (args.length === 1 && isAst(args[0])) {
    return [parseAst(args[0])];
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
