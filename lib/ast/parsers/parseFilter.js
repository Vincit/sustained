const {
  ListNode,
  FilterNode,
  FilterGroupNode,
  ValueListNode,
  ValueRangeNode
} = require('../nodes');

const {
  isAstNode,
  isAstBuilder,
  isPlainObject,
  isFunction,
  isBoolean,
  isString
} = require('../../utils/typeUtils');

const { parseIdValueObject } = require('./parseObject');
const { parseIdentifier } = require('./parseIdentifier');
const { parseOperator } = require('./parseOperator');
const { parseValue } = require('./parseValue');
const { parseRaw } = require('./parseRaw');

function parseFilter(args, opts) {
  opts = defaultOptions(opts);

  if (args.length === 1) {
    return parseOneArg(args, opts);
  } else if (args.length === 2) {
    return parseTwoArg(args, opts);
  } else if (args.length === 3) {
    return parseThreeArg(args, opts);
  }

  throw createError(args, opts);
}

function defaultOptions(opts) {
  return Object.assign(
    {
      lhsIsIdentifier: true,
      rhsIsIdentifier: false
    },
    opts
  );
}

function parseOneArg(args, opts) {
  const arg = args[0];

  if (isFunction(arg)) {
    return parseCallback(arg, opts);
  } else if (isBoolean(arg)) {
    return parseBoolean(arg, opts);
  } else if (isAstNode(arg)) {
    return parseAstNode(arg, opts);
  } else if (isAstBuilder(arg)) {
    return parseAstBuilder(arg, opts);
  } else if (isPlainObject(arg)) {
    return parsePlainObject(arg, opts);
  }

  throw createError(args, opts);
}

function parseCallback(arg, opts) {
  let nodes = [];
  let subBuilder = opts.queryBuilderClass.create(opts);

  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;
  subBuilder.ast.visitAllChildren({
    FilterNode(node) {
      nodes.push(node);
    }
  });

  if (nodes.length === 0) {
    return [];
  } else {
    return [FilterGroupNode.create(nodes, opts.bool, opts.not)];
  }
}

function parseBoolean(arg, opts) {
  return [
    opts.NodeClass.create(
      parseValue(arg ? 1 : 0, opts),
      parseOperator('='),
      parseValue(1, opts),
      opts.bool,
      opts.not
    )
  ];
}

function parseAstNode(arg, opts) {
  return [opts.NodeClass.create(arg.clone(), null, null, opts.bool, opts.not)];
}

function parseAstBuilder(arg, opts) {
  return [opts.NodeClass.create(arg.ast.clone(), null, null, opts.bool, opts.not)];
}

function parsePlainObject(arg, opts) {
  let keys = Object.keys(arg);
  let nodes = [];

  for (let i = 0, l = keys.length; i < l; ++i) {
    const key = keys[i];
    const val = arg[key];

    nodes = [...nodes, ...parseTwoArg([key, val], opts)];
  }

  return nodes;
}

function parseTwoArg(args, opts) {
  let [lhs, rhs] = args;
  return parseThreeArg([lhs, rhs === null ? 'is' : '=', rhs], opts);
}

function parseThreeArg(args, opts) {
  let [lhs, op, rhs] = args;
  op = op.toLowerCase().trim();

  if (isEmptyWhereIn(op, rhs)) {
    return parseEmptyWhereIn(lhs, op, rhs, opts);
  }

  return [
    opts.NodeClass.create(
      parseLhs(lhs, opts),
      parseOperator(op, opts),
      parseRhs(rhs, op, opts),
      opts.bool,
      opts.not
    )
  ];
}

function parseLhs(arg, opts) {
  if (arg === null) {
    return null;
  }

  if (opts.lhsIsIdentifier) {
    return parseIdentifier(arg, opts);
  } else {
    return parseValue(arg, opts);
  }
}

function parseRhs(arg, op, opts) {
  const isIn = isInOperator(op);
  const isBetween = isBetweenOperator(op);
  const parseFunc = opts.rhsIsIdentifier ? parseIdentifier : parseValue;

  if (Array.isArray(arg) && (isIn || isBetween)) {
    const nodes = arg.map(it => parseFunc(it, opts));

    if (isIn) {
      return ValueListNode.create(nodes);
    } else if (isBetween) {
      return ValueRangeNode.create(nodes[0], nodes[1]);
    } else {
      return ListNode.create(nodes);
    }
  } else {
    return parseFunc(arg, opts);
  }
}

function parseEmptyWhereIn(lhs, op, rhs, opts) {
  // knex quirk: empty in-filter is interpreted as 1 = 0.
  return [
    opts.NodeClass.create(
      parseRaw('1', []),
      parseOperator('='),
      parseValue(opts.not === (op === 'in') ? 1 : 0, opts),
      opts.bool,
      false
    )
  ];
}

function isEmptyWhereIn(op, rhs) {
  return isInOperator(op) && Array.isArray(rhs) && rhs.length === 0;
}

function isInOperator(op) {
  return op === 'in' || op === 'not in';
}

function isBetweenOperator(op) {
  return op === 'between' || op === 'not between';
}

function createError(args, opts) {
  return new Error(`invalid ${opts.NodeClass.name} call with arguments ${JSON.stringify(args)}`);
}

module.exports = {
  parseFilter
};
