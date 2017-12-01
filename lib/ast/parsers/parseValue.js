const { ValueNode, ListNode } = require('../nodes');
const { isString, isAstNode, isAstBuilder, isFunction } = require('../../utils/typeUtils');

function parseValue(value, opts) {
  if (value === undefined) {
    throw new Error('value cannot be undefined');
  }

  if (value === null) {
    return ValueNode.create(null);
  } else if (isFunction(value)) {
    let subBuilder = opts.subQueryBuilderClass.create();
    subBuilder = value.call(subBuilder, subBuilder) || subBuilder;
    return subBuilder.ast;
  } else if (Array.isArray(value)) {
    return ListNode.create(value.map(it => parseValue(it, opts)));
  } else if (isAstBuilder(value)) {
    return value.ast.clone();
  } else if (isAstNode(value)) {
    return value.clone();
  } else {
    return ValueNode.create(value);
  }
}

module.exports = {
  parseValue
};
