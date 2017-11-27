const { parseIdentifierWithAlias, parseIdentifier } = require('./parseIdentifier');
const {
  isString,
  isAstNode,
  isAstBuilder,
  isPlainObject,
  isFunction
} = require('../../utils/typeUtils');

function parseAliasableItems(args, opts) {
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
    return parseCallback(item, opts);
  } else if (isAstBuilder(item)) {
    return parseAstBuilder(item, opts);
  } else if (isAstNode(item)) {
    return parseAstNode(item, opts);
  } else if (isPlainObject(item)) {
    return parsePlainObject(item, opts);
  } else {
    throw new Error(`invalid ${opts.NodeClass.name} ${JSON.stringify(item)}`);
  }
}

function parseString(item, { NodeClass }) {
  return NodeClass.create(...parseIdentifierWithAlias(item));
}

function parseCallback(arg, opts) {
  let subBuilder = opts.astBuilderClass.create();
  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;
  return subBuilder.ast;
}

function parseAstBuilder(item, { NodeClass }) {
  return NodeClass.create(item.ast);
}

function parseAstNode(item, { NodeClass }) {
  return NodeClass.create(item);
}

function parsePlainObject(value, { NodeClass }) {
  const keys = Object.keys(value);

  return keys.map(key => {
    const val = value[key];

    let keyNode = parseIdentifier(key);
    let valNode = null;

    if (isAstNode(val)) {
      valNode = val;
    } else if (isAstBuilder(val)) {
      valNode = val.ast;
    } else {
      valNode = parseIdentifier(val);
    }

    return NodeClass.create(valNode, keyNode);
  });
}

module.exports = {
  parseAliasableItems
};
