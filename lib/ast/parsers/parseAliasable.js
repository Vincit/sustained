const { parseIdentifierWithAlias, parseIdentifier, parseAlias } = require('./parseIdentifier');
const { parseSubQueryCallback } = require('./parseCallback');
const {
  isString,
  isAstNode,
  isAstBuilder,
  isPlainObject,
  isFunction
} = require('../../utils/typeUtils');

function parseAliasable(args, opts) {
  return parseArray(args, opts);
}

function parseArray(items, opts) {
  return items.reduce((nodes, item) => nodes.concat(parseItem(item, opts)), []);
}

function parseItem(item, opts) {
  if (isString(item)) {
    return parseString(item, opts);
  } else if (Array.isArray(item)) {
    return parseArray(item, opts);
  } else if (isFunction(item)) {
    return parseSubQueryCallback(item, opts);
  } else if (isAstBuilder(item)) {
    return parseAstBuilder(item, opts);
  } else if (isAstNode(item)) {
    return parseAstNode(item, opts);
  } else if (isPlainObject(item)) {
    return parseAliasObject(item, opts);
  } else {
    throw new Error(`invalid ${opts.NodeClass.name} ${JSON.stringify(item)}`);
  }
}

function parseString(item, { NodeClass }) {
  return NodeClass.create(...parseIdentifierWithAlias(item));
}

function parseAstBuilder(item, { NodeClass }) {
  return NodeClass.create(item.ast);
}

function parseAstNode(item, { NodeClass }) {
  return NodeClass.create(item);
}

function parseAliasObject(value, { NodeClass }) {
  const keys = Object.keys(value);

  return keys.map(key => {
    const val = value[key];

    let aliasNode = parseAlias(key);
    let identifier = null;

    if (isAstNode(val)) {
      identifier = val;
    } else if (isAstBuilder(val)) {
      identifier = val.ast;
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
