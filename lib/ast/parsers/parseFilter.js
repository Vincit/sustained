const { FilterNode, FilterGroupNode } = require('../nodes');
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
  let subBuilder = opts.queryBuilderClass.create({
    subQueryBuilderClass: opts.subQueryBuilderClass
  });

  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;
  subBuilder.ast.visitAllChildren({
    AstNode(node) {
      if (node instanceof FilterNode) {
        nodes.push(node);
      }
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
      parseValue(arg ? 1 : 0),
      parseOperator('='),
      parseValue(1),
      opts.bool,
      opts.not
    )
  ];
}

function parseAstNode(arg, opts) {
  return [opts.NodeClass.create(arg, null, null, opts.bool, opts.not)];
}

function parseAstBuilder(arg, opts) {
  return [opts.NodeClass.create(arg.ast, null, null, opts.bool, opts.not)];
}

function parsePlainObject(arg, opts) {
  return parseIdValueObject(arg, opts).properties.map(prop => {
    return opts.NodeClass.create(prop.key, parseOperator('='), prop.value, opts.bool, opts.not);
  });
}

function parseTwoArg(args, opts) {
  return [
    opts.NodeClass.create(
      parseLhs(args[0], opts),
      parseOperator('=', opts),
      parseRhs(args[1], opts),
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
        parseOperator(args[1], opts),
        parseRhs(args[2], opts),
        opts.bool,
        opts.not
      )
    ];
  } else {
    return [
      opts.NodeClass.create(
        parseLhs(args[0], opts),
        parseOperator(args[1], opts),
        parseRhs(args[2], opts),
        opts.bool,
        opts.not
      )
    ];
  }
}

function parseLhs(arg, opts) {
  if (opts.lhsIsIdentifier) {
    return parseIdentifier(arg, opts);
  } else {
    return parseValue(arg, opts);
  }
}

function parseRhs(arg, opts) {
  if (opts.rhsIsIdentifier) {
    return parseIdentifier(arg, opts);
  } else {
    return parseValue(arg, opts);
  }
}

function createError(args, opts) {
  return new Error(`invalid ${opts.NodeClass.name} call with arguments ${JSON.stringify(args)}`);
}

module.exports = {
  parseFilter
};
