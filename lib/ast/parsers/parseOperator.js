const { OperatorNode } = require('../nodes');
const { isString, isAst } = require('../../utils/typeUtils');
const { parseAst } = require('./parseAst');

function parseOperator(operator) {
  if (isAst(operator)) {
    return parseAst(operator);
  } else if (isString(operator)) {
    return OperatorNode.create(operator.toLowerCase().trim());
  } else {
    throw new Error(`invalid operator ${operator}`);
  }
}

module.exports = {
  parseOperator
};
