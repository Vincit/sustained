import { WithNode } from '../nodes'
import { parseValue } from './parseValue'
import { parseAlias } from './parseIdentifier'

export function parseWith(args, opts) {
  if (args.length === 1) {
    return parseOneArg(args, opts)
  } else if (args.length === 2) {
    return parseTwoArgs(args, opts)
  } else {
    throw new Error(`invalid WhereNode ${JSON.stringify(item)}`)
  }
}

function parseOneArg(args, opts) {
  return parseObject(args[0], opts)
}

function parseTwoArgs(args, opts) {
  const node = parseValue(args[1], opts)
  const alias = parseAlias(args[0])

  return [new WithNode(node, alias)]
}

function parseObject(value, opts) {
  return Object.keys(value).map((key) => {
    const node = parseValue(value[key], opts)
    const alias = parseAlias(key)

    return new WithNode(node, alias)
  })
}
