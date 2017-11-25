const { RawNode, BindingNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { parseValue } = require('./parseValue');

const { isPlainObject, isString, isAstBuilder, isAstNode } = require('../../utils/typeUtils');

function parseRaw(sql, bindings) {
  if (!sql) {
    throw new Error(`invalid sql ${sql}`);
  }

  // Special case where only a query builder or an AST node is
  // passed to the query builder.
  if (bindings.length === 0) {
    let node = null;

    if (isAstBuilder(sql)) {
      node = sql.ast;
    } else if (isAstNode(sql)) {
      node = sql;
    }

    if (node) {
      return parseRaw('?', [node]);
    }
  }

  sql = sql.toString();

  if (bindings.length === 1 && Array.isArray(bindings[0])) {
    bindings = bindings[0];
  }

  if (bindings.length === 1 && isPlainObject(bindings[0])) {
    return parseObjectRaw(sql, bindings[0]);
  } else {
    return parseArrayRaw(sql, bindings);
  }
}

function parseArrayRaw(sql, bindings) {
  const regex = /(\?\??)/g;
  const bindingNodes = [];

  let idx = 0;
  let match = null;

  while ((match = regex.exec(sql))) {
    const str = match[1];
    let node;

    if (idx >= bindings.length) {
      throw new Error(`value not provided for all bindings in string ${sql}`);
    }

    if (match.index > 0 && sql[match.index - 1] === '\\') {
      continue;
    }

    if (str === '??') {
      node = parseIdentifier(bindings[idx]);
    } else {
      node = parseValue(bindings[idx]);
    }

    bindingNodes.push(BindingNode.create(str, match.index, node));
    ++idx;
  }

  return RawNode.create(sql, bindingNodes);
}

function parseObjectRaw(sql, bindings) {
  const regex = /(:\w+:?)/g;
  const bindingNodes = [];

  let match = null;

  while ((match = regex.exec(sql))) {
    const str = match[1];

    // Skip `::` which is used for casting in some dialects.
    if (match.index !== 0 && sql[match.index - 1] === ':') {
      continue;
    }

    const key = str.replace(/:/g, '');
    const binding = bindings[key];
    let node;

    if (!binding) {
      throw new Error(`value not provided binding ${key} in ${sql}`);
    }

    if (str.startsWith(':') && str.endsWith(':')) {
      node = parseIdentifier(binding);
    } else {
      node = parseValue(binding);
    }

    bindingNodes.push(BindingNode.create(str, match.index, node));
  }

  return RawNode.create(sql, bindingNodes);
}

module.exports = {
  parseRaw
};
