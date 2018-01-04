const { JoinNode, AliasableNode } = require('../nodes');
const { parseAliasable } = require('./parseAliasable');
const { isFunction, isAst } = require('../../utils/typeUtils');
const { parseAst } = require('./parseAst');

function parseJoin(args, opts) {
  if (args.length === 1 && isAst(args[0])) {
    return [parseAst(args[0])];
  }

  const target = parseAliasable(
    args.slice(0, 1),
    Object.assign({}, opts, { NodeClass: AliasableNode })
  )[0];

  let joinBuilder = opts.queryBuilderClass.JoinBuilder.create({
    target,
    joinType: opts.joinType,
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
