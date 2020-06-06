import { ReturningNode } from '../nodes'
import { parseAliasable } from './parseAliasable'

export function parseReturning(args, opts) {
  return parseAliasable(args, Object.assign({}, opts, { NodeClass: ReturningNode }))
}
