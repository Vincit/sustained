const { GroupByNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { parseSubQueryCallback } = require('./parseCallback');
const { isString, isAst, isFunction, isArray } = require('../../utils/typeUtils');
const { parseAst } = require('./parseAst');

function parseGroupBy(args, opts) {
  return parseArray(args, opts);
}

function parseArray(items, opts) {
  return items.reduce((nodes, item) => nodes.concat(parseItem(item, opts)), []);
}

function parseItem(item, opts) {
  if (isString(item)) {
    return parseString(item, opts);
  } else if (isArray(item)) {
    return parseArray(item, opts);
  } else if (isFunction(item)) {
    return parseSubQueryCallback(item, opts);
  } else if (isAst(item)) {
    return parseAstItem(item, opts);
  } else {
    throw new Error(`invalid ${GroupByNode.name} ${JSON.stringify(item)}`);
  }
}

function parseString(item, opts) {
  return GroupByNode.create(parseIdentifier(item));
}

function parseAstItem(item, opts) {
  return GroupByNode.create(parseAst(item));
}

module.exports = {
  parseGroupBy
};
