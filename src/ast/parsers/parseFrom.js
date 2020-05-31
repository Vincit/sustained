import { FromNode } from '../nodes'
import { parseAliasable } from './parseAliasable'
import { isPlainObject } from '../../utils/typeUtils'

const FROM_OPTIONS = ['only']

export function parseFrom(argsIn, opts) {
  const [args, options] = splitOptions(argsIn)
  const nodes = parseAliasable(args, Object.assign({}, opts, { NodeClass: FromNode }))

  return {
    nodes,
    options,
  }
}

function splitOptions(args) {
  if (args.length > 1 && isOptionsObject(args[args.length - 1])) {
    return [args.slice(0, args.length - 1), args[args.length - 1]]
  } else {
    return [args, {}]
  }
}

function isOptionsObject(obj) {
  return isPlainObject(obj) && Object.keys(obj).every((key) => FROM_OPTIONS.includes(key))
}
