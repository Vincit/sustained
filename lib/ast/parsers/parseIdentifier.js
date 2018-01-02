const { IdentifierNode } = require('../nodes');
const { isString, isAst } = require('../../utils/typeUtils');
const { parseAst } = require('./parseAst');

const ALIAS_OPTIONS = {
  dontSplitOnDots: true
};

function parseIdentifier(identifier, opts) {
  if (isAst(identifier)) {
    return parseAst(identifier);
  } else if (isString(identifier)) {
    if (opts && opts.dontSplitOnDots) {
      return IdentifierNode.create([identifier]);
    } else {
      return IdentifierNode.create(identifier.split('.'));
    }
  } else {
    throw new Error(`invalid identifier ${JSON.stringify(identifier, null, 2)}`);
  }
}

function parseAlias(alias) {
  return parseIdentifier(alias, ALIAS_OPTIONS);
}

function parseIdentifierWithAlias(identifier) {
  const parts = identifier.split(/\sas\s/i);

  if (parts.length === 2) {
    return [parseIdentifier(parts[0]), parseAlias(parts[1])];
  } else {
    return [parseIdentifier(identifier)];
  }
}

module.exports = {
  parseAlias,
  parseIdentifier,
  parseIdentifierWithAlias
};
