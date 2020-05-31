import { OrderByNode } from '../nodes'
import { OrderByDir } from '../nodes/OrderByNode'
import { parseIdentifier } from './parseIdentifier'
import { parseSubQueryCallback } from './parseCallback'
import { isString, isAst, isFunction, isArray } from '../../utils/typeUtils'
import { parseAst } from './parseAst'

export function parseOrderBy(argsIn, opts) {
  const [args, dir] = parseDirection(argsIn)
  const nodes = parseArray(args, opts)

  if (!opts.ignoreDirection) {
    nodes.forEach((node) => {
      node.dir = dir
    })
  }

  return nodes
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
  } else if (isAst(item)) {
    return parseAstItem(item, opts)
  } else {
    throw new Error(`invalid ${OrderByNode.name} ${JSON.stringify(item)}`)
  }
}

function parseString(item, opts) {
  return new OrderByNode(parseIdentifier(item))
}

function parseAstItem(item, opts) {
  return new OrderByNode(parseAst(item))
}

function parseDirection(args) {
  if (args.length <= 1) {
    return [args, OrderByDir.Asc]
  } else {
    const lastArg = args[args.length - 1]

    if (isString(lastArg)) {
      if (lastArg.toLowerCase() === OrderByDir.Desc) {
        return [args.slice(0, args.length - 1), OrderByDir.Desc]
      } else if (lastArg.toLowerCase() === OrderByDir.Asc) {
        return [args.slice(0, args.length - 1), OrderByDir.Asc]
      } else {
        return [args, OrderByDir.Asc]
      }
    } else {
      return [args, OrderByDir.Asc]
    }
  }
}
