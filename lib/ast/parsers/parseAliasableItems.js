const { parseIdentifierWithAlias, parseIdentifier } = require('./parseIdentifier');
const { isString, isAstNode, isAstBuilder, isPlainObject } = require('../../utils/typeUtils');

function parseAliasableItems(args, opts) {
  if (args.length === 1 && Array.isArray(args[0])) {
    return parseItems(args[0], opts);
  } else if (args.length === 1 && isPlainObject(args[0])) {
    return parseObject(args[0], opts);
  } else {
    return parseItems(args, opts);
  }
}

function parseItems(items, opts) {
  return items.map(it => parseItem(it, opts));
}

function parseItem(item, { NodeClass }) {
  if (isString(item)) {
    return NodeClass.create(...parseIdentifierWithAlias(item));
  } else if (isAstBuilder(item)) {
    return NodeClass.create(item.ast);
  } else if (isAstNode(item)) {
    return NodeClass.create(item);
  } else {
    throw new Error(`invalid ${NodeClass.name} ${item}`);
  }
}

function parseObject(value, { NodeClass }) {
  const keys = Object.keys(value);
  const nodes = new Array(keys.length);

  for (let i = 0, l = keys.length; i < l; ++i) {
    const key = keys[i];
    const val = value[key];

    let keyNode = parseIdentifier(key);
    let valNode = null;

    if (isAstBuilder(val)) {
      valNode = val.ast;
    } else {
      valNode = parseIdentifier(val);
    }

    nodes[i] = NodeClass.create(valNode, keyNode);
  }

  return nodes;
}

module.exports = {
  parseAliasableItems
};
