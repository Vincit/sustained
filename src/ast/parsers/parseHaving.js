import { HavingNode } from '../nodes'
import { parseFilter } from './parseFilter'

export function parseHaving(args, opts) {
  return parseFilter(args, Object.assign({}, opts, { NodeClass: HavingNode }))
}
