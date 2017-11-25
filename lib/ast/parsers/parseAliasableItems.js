const { parseIdentifierWithAlias, parseIdentifier } = require('./parseIdentifier');
const { isString, isAstNode, isAstBuilder, isPlainObject, isFunction } = require('../../utils/typeUtils');

function parseAliasableItems(args, opts) {
  return parseArray(args, opts, []);
}

function parseArray(items, opts, nodes) {
  items.forEach(item => {
    if (isString(item)) {
      parseString(item, opts, nodes);
    } else if (Array.isArray(item)) {
      parseArray(item, opts, nodes);
    } else if (isFunction(item)) {
      parseCallback(item, opts, nodes);
    } else if (isAstBuilder(item)) {
      parseAstBuilder(item, opts, nodes);
    } else if (isAstNode(item)) {
      parseAstNode(item, opts, nodes);
    } else if (isPlainObject(item)) {
      parseObject(item, opts, nodes);
    } else {
      throw new Error(`invalid ${opts.NodeClass.name} ${JSON.stringify(item)}`);
    }
  });

  return nodes;
}

function parseString(item, { NodeClass }, nodes) {
  nodes.push(NodeClass.create(...parseIdentifierWithAlias(item)));
  return nodes;
}

function parseCallback(arg, opts, nodes) {
  let subBuilder = opts.astBuilderClass.create();
  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder;
  return nodes.push(subBuilder.ast);
}

function parseAstBuilder(item, { NodeClass }, nodes) {
  nodes.push(NodeClass.create(item.ast));
  return nodes;
}

function parseAstBuilder(item, { NodeClass }, nodes) {
  nodes.push(NodeClass.create(item.ast));
  return nodes;
}

function parseAstNode(item, { NodeClass }, nodes) {
  nodes.push(NodeClass.create(item));
  return nodes;
}

function parseObject(value, { NodeClass }, nodes) {
  const keys = Object.keys(value);

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

    nodes.push(NodeClass.create(valNode, keyNode));
  }

  return nodes;
}

module.exports = {
  parseAliasableItems
};
