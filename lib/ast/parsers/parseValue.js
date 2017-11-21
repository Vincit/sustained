const { ValueNode, ListNode } = require('../nodes');
const {
  isString,
  isAstNode,
  isAstBuilder,
  isPlainObject,
  isFunction
} = require('../../utils/typeUtils');

function parseValue(value, opts) {
  if (value === undefined) {
    throw new Error('value cannot be undefined');
  }

  if (value === null) {
    return ValueNode.create(null);
  } else if (isFunction(value)) {
    return value(opts.astBuilderClass.create()).ast;
  } else if (Array.isArray(value)) {
    return ListNode.create(value.map(parseValue));
  } else if (isAstBuilder(value)) {
    return value.ast;
  } else if (isAstNode(value)) {
    return value;
  } else if (isPlainObject(value)) {
  } else {
    return ValueNode.create(value);
  }
}

module.exports = {
  parseValue
};
