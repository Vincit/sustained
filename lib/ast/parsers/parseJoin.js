const { JoinNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { isFunction, isAstBuilder } = require('../../utils/typeUtils');

function parseJoin(args, opts) {
  if (args.length === 1 && isAstBuilder(args[0])) {
    return [args[0].ast];
  }

  let JoinBuilder = opts.joinAstBuilderClass;
  let joinBuilder = new JoinBuilder({
    joinType: opts.joinType,
    target: parseIdentifier(args[0])
  });

  if (args.length === 2 && isFunction(args[1])) {
    joinBuilder = args[1].call(joinBuilder, joinBuilder) || joinBuilder;
  } else {
    joinBuilder.on(...args.slice(1));
  }

  return [joinBuilder.ast];
}

module.exports = {
  parseJoin
};
