import { AliasableNode } from '../nodes'
import { parseAliasable } from './parseAliasable'
import { isFunction, isOperation } from '../../utils/typeUtils'
import { parseOperation } from './parseOperation'

export function parseJoin(args, opts) {
  if (args.length === 1 && isOperation(args[0])) {
    return [parseOperation(args[0])]
  }

  const target = parseAliasable(
    args.slice(0, 1),
    Object.assign({}, opts, { NodeClass: AliasableNode })
  )[0]

  let joinBuilder = new opts.queryBuilderClass.JoinBuilder({
    target,
    joinType: opts.joinType,
    subQueryBuilderClass: opts.subQueryBuilderClass,
  })

  if (args.length === 2 && isFunction(args[1])) {
    joinBuilder = args[1].call(joinBuilder, joinBuilder) || joinBuilder
  } else if (args.length >= 2) {
    joinBuilder.on(...args.slice(1))
  }

  return [joinBuilder.operationNode]
}
