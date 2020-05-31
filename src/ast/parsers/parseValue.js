import { ValueNode, ValueListNode } from '../nodes'
import { parseSubQueryCallback } from './parseCallback'
import { parseAst } from './parseAst'
import { isAst, isFunction, isArray, isNull, isUndefined } from '../../utils/typeUtils'

export function parseValue(value, opts) {
  if (isUndefined(value)) {
    throw new Error('value cannot be undefined')
  } else if (isNull(value)) {
    return parseNull(value)
  } else if (isFunction(value)) {
    return parseFunction(value, opts)
  } else if (isArray(value)) {
    return parseArray(value, opts)
  } else if (isAst(value)) {
    return parseAstItem(value)
  } else {
    return parsePrimitive(value)
  }
}

function parseNull(value) {
  return new ValueNode(value)
}

function parseFunction(value, opts) {
  return parseSubQueryCallback(value, opts)
}

function parseArray(value, opts) {
  return new ValueListNode(value.map((it) => parseValue(it, opts)))
}

function parseAstItem(value) {
  return parseAst(value)
}

function parsePrimitive(value) {
  return new ValueNode(value)
}
