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
  return items.reduce((nodes, item) => {
    if (isString(item)) {
      return nodes.concat(parseString(item, opts));
    } else if (Array.isArray(item)) {
      return nodes.concat(parseArray(item, opts));
    } else if (isFunction(item)) {
      return nodes.concat(parseCallback(item, opts));
    } else if (isAstBuilder(item)) {
      return nodes.concat(parseAstBuilder(item, opts));
    } else if (isAstNode(item)) {
      return nodes.concat(parseAstNode(item, opts));
    } else if (isPlainObject(item)) {
      return nodes.concat(parseObject(item, opts));
    } else {
      throw new Error(`invalid ${opts.NodeClass.name} ${JSON.stringify(item)}`);
    }
  }, []);
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

function parseAstNode(item, { NodeClass }, nodes) {
  return NodeClass.create(item);
}

function parseObject(value, { NodeClass }) {
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
