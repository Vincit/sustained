import { InsertNode } from '../nodes'
import { parseIdValueObject } from './parseObject'
import { parseSubQueryCallback } from './parseCallback'
import { isOperation, isFunction, isArray } from '../../utils/typeUtils'
import { parseOperation } from './parseOperation'

export function parseInsert(args, opts) {
  const arg = args[0]

  if (isArray(arg)) {
    return new InsertNode(arg.map((it) => parseArg(it, opts)))
  } else if (arg) {
    return new InsertNode([parseArg(arg, opts)])
  } else {
    return new InsertNode([])
  }
}

function parseArg(arg, opts) {
  if (isOperation(arg)) {
    return parseOperation(arg)
  } else if (isFunction(arg)) {
    return parseSubQueryCallback(arg, opts)
  } else {
    return parseIdValueObject(arg, opts)
  }
}
