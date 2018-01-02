const { ValueNode, ValueListNode } = require('../nodes');
const { parseSubQueryCallback } = require('./parseCallback');
const { parseAst } = require('./parseAst');
const {
  isAst,
  isString,
  isFunction,
  isArray,
  isNull,
  isUndefined
} = require('../../utils/typeUtils');

function parseValue(value, opts) {
  if (isUndefined(value)) {
    throw new Error('value cannot be undefined');
  } else if (isNull(value)) {
    return parseNull(value);
  } else if (isFunction(value)) {
    return parseFunction(value, opts);
  } else if (isArray(value)) {
    return parseArray(value, opts);
  } else if (isAst(value)) {
    return parseAstItem(value);
  } else {
    return parsePrimitive(value);
  }
}

function parseNull(value) {
  return ValueNode.create(value);
}

function parseFunction(value, opts) {
  return parseSubQueryCallback(value, opts);
}

function parseArray(value, opts) {
  return ValueListNode.create(value.map(it => parseValue(it, opts)));
}

function parseAstItem(value) {
  return parseAst(value);
}

function parsePrimitive(value) {
  return ValueNode.create(value);
}

module.exports = {
  parseValue
};
