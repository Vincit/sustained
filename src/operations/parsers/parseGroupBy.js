import { GroupByNode } from '../nodes'
import { parseIdentifier } from './parseIdentifier'
import { parseSubQueryCallback } from './parseCallback'
import { isString, isOperation, isFunction, isArray } from '../../utils/typeUtils'
import { parseOperation } from './parseOperation'

export function parseGroupBy(args, opts) {
  return parseArray(args, opts)
}

function parseArray(items, opts) {
  return items.reduce((nodes, item) => nodes.concat(parseItem(item, opts)), [])
}

function parseItem(item, opts) {
  if (isString(item)) {
    return parseString(item, opts)
  } else if (isArray(item)) {
    return parseArray(item, opts)
  } else if (isFunction(item)) {
    return parseSubQueryCallback(item, opts)
  } else if (isOperation(item)) {
    return parseOperationItem(item, opts)
  } else {
    throw new Error(`invalid ${GroupByNode.name} ${JSON.stringify(item)}`)
  }
}

function parseString(item, opts) {
  return new GroupByNode(parseIdentifier(item))
}

function parseOperationItem(item, opts) {
  return new GroupByNode(parseOperation(item))
}
