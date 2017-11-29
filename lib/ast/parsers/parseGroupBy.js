const { GroupByNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { isString, isAstNode, isAstBuilder, isFunction } = require('../../utils/typeUtils');

function parseGroupBy(args, opts) {
  return parseArray(args, opts);
}

function parseArray(items, opts) {
  return items.reduce((nodes, item) => nodes.concat(parseItem(item, opts)), []);
}

function parseItem(item, opts) {
  if (isString(item)) {
    return parseString(item, opts);
  } else if (Array.isArray(item)) {
    return parseArray(item, opts);
  } else if (isFunction(item)) {
    return parseCallback(item, opts);
  } else if (isAstBuilder(item)) {
    return parseAstBuilder(item, opts);
  } else if (isAstNode(item)) {
    return parseAstNode(item, opts);
  } else {
    throw new Error(`invalid ${GroupByNode.name} ${JSON.stringify(item)}`);
  }
}

function parseString(item, opts) {
  return GroupByNode.create(parseIdentifier(item));
}

function parseCallback(arg, opts) {
  let subBuilder = opts.subQueryBuilderClass.create();
  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;
  return GroupByNode.create(subBuilder.ast);
}

function parseAstBuilder(item, opts) {
  return GroupByNode.create(item.ast);
}

function parseAstNode(item, opts, nodes) {
  return GroupByNode.create(item);
}

module.exports = {
  parseGroupBy
};
