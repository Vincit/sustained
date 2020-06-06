import { WhereNode } from '../nodes'
import { parseFilter } from './parseFilter'

export function parseWhere(args, opts) {
  return parseFilter(args, Object.assign({}, opts, { NodeClass: WhereNode }))
}
