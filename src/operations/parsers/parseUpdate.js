import { UpdateNode } from '../nodes'
import { parseIdValueObject } from './parseObject'

export function parseUpdate(args, opts) {
  return new UpdateNode(parseIdValueObject(args[0], opts))
}
