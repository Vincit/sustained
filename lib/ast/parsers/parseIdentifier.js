const { IdentifierNode } = require('../nodes');
const { isString, isAstNode } = require('../../utils/typeUtils');

function parseIdentifier(identifier) {
  if (isAstNode(identifier)) {
    return identifier;
  } else if (isString(identifier)) {
    return IdentifierNode.create(identifier.split('.'));
  }

  throw new Error(`invalid identifier ${JSON.stringify(identifier, null, 2)}`);
}

function parseIdentifierWithAlias(identifier) {
  const parts = identifier.split(/\sas\s/);

  if (parts.length === 2) {
    return [parseIdentifier(parts[0]), parseIdentifier(parts[1])];
  } else {
    return [parseIdentifier(identifier)];
  }
}

module.exports = {
  parseIdentifier,
  parseIdentifierWithAlias
};
