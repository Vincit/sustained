const { OperatorNode } = require('../nodes');
const { isString, isAstNode } = require('../../utils/typeUtils');

function parseOperator(operator) {
  if (isAstNode(operator)) {
    return operator;
  } else if (isString(operator)) {
    return OperatorNode.create(operator.toLowerCase());
  }

  throw new Error(`invalid operator ${operator}`);
}

module.exports = {
  parseOperator
};
