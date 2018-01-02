const { parseAst } = require('./parseAst');
const { parseIdentifierWithAlias, parseIdentifier, parseAlias } = require('./parseIdentifier');
const { parseSubQueryCallback } = require('./parseCallback');
const { isAst, isString, isPlainObject, isFunction, isArray } = require('../../utils/typeUtils');

function parseAliasable(args, opts) {
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
  } else if (isPlainObject(item)) {
    return parseAliasObject(item, opts);
  } else {
    throw new Error(`invalid ${opts.NodeClass.name} ${JSON.stringify(item)}`);
  }
}

function parseString(item, { NodeClass }) {
  return NodeClass.create(...parseIdentifierWithAlias(item));
}

function parseAstItem(item, { NodeClass }) {
  return NodeClass.create(parseAst(item));
}

function parseAliasObject(value, { NodeClass }) {
  const keys = Object.keys(value);

  return keys.map(key => {
    const val = value[key];

    let aliasNode = parseAlias(key);
    let identifier = null;

    if (isAst(val)) {
      identifier = parseAst(val);
    } else {
      identifier = parseIdentifier(val);
    }

    return NodeClass.create(identifier, aliasNode);
  });
}

module.exports = {
  parseAliasable,
  parseAliasObject
};
