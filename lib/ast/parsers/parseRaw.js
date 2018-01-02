const { RawNode, BindingNode, AliasableNode, ListNode } = require('../nodes');
const { parseAliasObject } = require('./parseAliasable');
const { parseIdentifier } = require('./parseIdentifier');
const { parseValue } = require('./parseValue');
const { parseAst } = require('./parseAst');

const { isPlainObject, isObject, isString, isAst } = require('../../utils/typeUtils');

function parseRaw(sql, bindings = []) {
  if (!sql) {
    throw new Error(`invalid sql ${sql}`);
  }

  // Special case where only a query builder or an AST node is given.
  if (isObject(sql)) {
    return parseQueryBuilder(sql);
  }

  sql = sql.toString();

  if (bindings.length === 1 && isPlainObject(bindings[0])) {
    return parseObjectRaw(sql, bindings[0]);
  } else if (bindings.length === 1 && Array.isArray(bindings[0])) {
    return parseArrayRaw(sql, bindings[0]);
  } else {
    return parseArrayRaw(sql, bindings);
  }
}

function parseQueryBuilder(arg) {
  let node = null;

  if (isAst(arg)) {
    node = parseAst(arg);
  }

  if (node) {
    return parseRaw('?', [node]);
  } else {
    throw new Error(`invalid single argument to raw ${JSON.stringify(arg)}`);
  }
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

    if (!binding) {
      throw new Error(`value not provided binding ${key} in ${sql}`);
    }

    const node = parseObjectBinding(str, binding);

    bindingNodes.push(BindingNode.create(str, match.index, node));
  }

  return RawNode.create(sql, bindingNodes);
}

function parseObjectBinding(matchStr, binding) {
  if (matchStr.startsWith(':') && matchStr.endsWith(':')) {
    if (isPlainObject(binding)) {
      return ListNode.create(parseAliasObject(binding, { NodeClass: AliasableNode }));
    } else {
      return parseIdentifier(binding);
    }
  } else {
    return parseValue(binding);
  }
}

function parseArrayRaw(sql, bindings) {
  const regex = /(\?\??)/g;
  const bindingNodes = [];

  let idx = 0;
  let match = null;

  while ((match = regex.exec(sql))) {
    const str = match[1];

    if (idx >= bindings.length) {
      throw new Error(`value not provided for all bindings in string ${sql}`);
    }

    if (match.index > 0 && sql[match.index - 1] === '\\') {
      continue;
    }

    const node = parseArrayBinding(str, bindings[idx]);

    bindingNodes.push(BindingNode.create(str, match.index, node));
    ++idx;
  }

  return RawNode.create(sql, bindingNodes);
}

function parseArrayBinding(matchStr, binding) {
  if (matchStr === '??') {
    if (isPlainObject(binding)) {
      return ListNode.create(parseAliasObject(binding, { NodeClass: AliasableNode }));
    } else {
      return parseIdentifier(binding);
    }
  } else {
    return parseValue(binding);
  }
}

module.exports = {
  parseRaw
};
