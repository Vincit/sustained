const { WhereNode, ListNode } = require('../nodes');
const { isPlainObject, isFunction } = require('../../utils/typeUtils');

const { parseIdValueObject } = require('./parseObject');
const { parseIdentifier } = require('./parseIdentifier');
const { parseOperator } = require('./parseOperator');
const { parseValue } = require('./parseValue');

function parseWhere(args, opts = {}) {
  if (args.length === 1) {
    return parseOneArgWhere(args, opts);
  } else if (args.length === 2) {
    return parseTwoArgWhere(args, opts);
  } else if (args.length === 3) {
    return parseThreeArgWhere(args, opts);
  }

  throw createError(args);
}

function parseOneArgWhere(args, opts) {
  const arg = args[0];

  if (isFunction(arg)) {
    return [ListNode.create(arg(opts.astBuilderClass.create()).ast.where)];
  }

  if (!isPlainObject(arg)) {
    throw createError(args);
  }

  return parseIdValueObject(arg, opts).properties.map(prop => {
    return WhereNode.create(prop.key, parseOperator('='), prop.value, opts.bool, opts.not);
  });
}

function parseTwoArgWhere(args, opts) {
  return [
    WhereNode.create(
      parseIdentifier(args[0]),
      parseOperator('='),
      parseValue(args[1], opts),
      opts.bool,
      opts.not
    )
  ];
}

function parseThreeArgWhere(args, opts) {
  if (args[0] === null) {
    return [
      WhereNode.create(null, parseOperator(args[1]), parseValue(args[2], opts), opts.bool, opts.not)
    ];
  } else {
    return [
      WhereNode.create(
        parseIdentifier(args[0]),
        parseOperator(args[1]),
        parseValue(args[2], opts),
        opts.bool,
        opts.not
      )
    ];
  }
}

function createError(args) {
  return new Error(`invalid where call with arguments ${JSON.stringify(args)}`);
}

module.exports = {
  parseWhere
};
