const { OperatorNode } = require('../nodes');
const { isString, isAstNode, isAstBuilder } = require('../../utils/typeUtils');

function parseOperator(operator) {
  if (isAstNode(operator)) {
    return operator;
  } else if (isAstBuilder(operator)) {
    return operator.ast;
  } else if (isString(operator)) {
    return OperatorNode.create(operator.toLowerCase().trim());
  }

  throw new Error(`invalid operator ${operator}`);
}

module.exports = {
  parseOperator
};
