const { OrderByNode } = require('../nodes');
const { OrderByDir } = require('../nodes/OrderByNode');
const { parseIdentifier } = require('./parseIdentifier');
const { isString, isAstNode, isAstBuilder, isFunction } = require('../../utils/typeUtils');

function parseOrderBy(argsIn, opts) {
  const [args, dir] = parseDirection(argsIn);
  const nodes = parseArray(args, opts);

  nodes.forEach(node => {
    node.dir = dir;
  });

  return nodes;
}

function parseArray(items, opts) {
  return items.reduce((nodes, item) => {
    if (isString(item)) {
      return nodes.concat(parseString(item, opts));
    } else if (Array.isArray(item)) {
      return nodes.concat(parseArray(item, opts));
    } else if (isFunction(item)) {
      return nodes.concat(parseCallback(item, opts));
    } else if (isAstBuilder(item)) {
      return nodes.concat(parseAstBuilder(item, opts));
    } else if (isAstNode(item)) {
      return nodes.concat(parseAstNode(item, opts));
    } else {
      throw new Error(`invalid ${OrderByNode.name} ${JSON.stringify(item)}`);
    }
  }, []);
}

function parseString(item, opts) {
  return OrderByNode.create(parseIdentifier(item));
}

function parseCallback(arg, opts) {
  let subBuilder = opts.astBuilderClass.create();
  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;
  return OrderByNode.create(subBuilder.ast);
}

function parseAstBuilder(item, opts) {
  return OrderByNode.create(item.ast);
}

function parseAstNode(item, opts, nodes) {
  return OrderByNode.create(item);
}

function parseDirection(args) {
  if (args.length <= 1) {
    return [args, OrderByDir.Asc];
  } else {
    const lastArg = args[args.length - 1];

    if (isString(lastArg)) {
      if (lastArg.toLowerCase() === OrderByDir.Desc) {
        return [args.slice(0, args.length - 1), OrderByDir.Desc];
      } else if (lastArg.toLowerCase() === OrderByDir.Asc) {
        return [args.slice(0, args.length - 1), OrderByDir.Asc];
      } else {
        return [args, OrderByDir.Asc];
      }
    } else {
      return [args, OrderByDir.Asc];
    }
  }
}

module.exports = {
  parseOrderBy
};
