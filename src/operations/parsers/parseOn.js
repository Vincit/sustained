import { JoinOnNode } from '../nodes'
import { parseFilter } from './parseFilter'

export function parseOn(args, opts) {
  return parseFilter(args, Object.assign({}, opts, { NodeClass: JoinOnNode }))
}

export { parseOn }
