const { ListNode } = require('../nodes');
const {
  isAstNode,
  isAstBuilder,
  isPlainObject,
  isFunction,
  isBoolean
} = require('../../utils/typeUtils');

const { parseIdValueObject } = require('./parseObject');
const { parseIdentifier } = require('./parseIdentifier');
const { parseOperator } = require('./parseOperator');
const { parseValue } = require('./parseValue');

function parseFilter(args, opts) {
  if (args.length === 1) {
    return parseOneArg(args, opts);
  } else if (args.length === 2) {
    return parseTwoArg(args, opts);
  } else if (args.length === 3) {
    return parseThreeArg(args, opts);
  }

  throw createError(args, opts);
}

function parseOneArg(args, opts) {
  const arg = args[0];

  if (isFunction(arg)) {
    return parseCallback(arg, opts);
  } else if (isBoolean(arg)) {
    return [opts.NodeClass.create(parseValue(arg ? 1 : 0), parseOperator('='), parseValue(1))];
  } else if (isAstNode(arg)) {
    return [arg];
  } else if (isAstBuilder(arg)) {
    return [arg.ast];
  }
  if (isPlainObject(arg)) {
    return parseIdValueObject(arg, opts).properties.map(prop => {
      return opts.NodeClass.create(prop.key, parseOperator('='), prop.value, opts.bool, opts.not);
    });
  }

  throw createError(args, opts);
}

function parseCallback(arg, opts) {
  let subBuilder = opts.astBuilderClass.create();
  let nodes = [];

  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;

  subBuilder.ast.forEachChild(node => {
    if (node instanceof opts.NodeClass) {
      nodes.push(node);
    }
  });

  return [ListNode.create(nodes)];
}

function parseTwoArg(args, opts) {
  return [
    opts.NodeClass.create(
      parseIdentifier(args[0]),
      parseOperator('='),
      parseValue(args[1], opts),
      opts.bool,
      opts.not
    )
  ];
}

function parseThreeArg(args, opts) {
  if (args[0] === null) {
    return [
      opts.NodeClass.create(
        null,
        parseOperator(args[1]),
        parseValue(args[2], opts),
        opts.bool,
        opts.not
      )
    ];
  } else {
    return [
      opts.NodeClass.create(
        parseIdentifier(args[0]),
        parseOperator(args[1]),
        parseValue(args[2], opts),
        opts.bool,
        opts.not
      )
    ];
  }
}

function createError(args, opts) {
  return new Error(`invalid ${opts.NodeClass.name} call with arguments ${JSON.stringify(args)}`);
}

module.exports = {
  parseFilter
};
