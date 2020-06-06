import { ListNode, FilterGroupNode, ValueListNode, ValueRangeNode } from '../nodes'
import { isOperation, isPlainObject, isFunction, isBoolean, isNumber } from '../../utils/typeUtils'
import { Bool } from '../nodes/FilterNode'
import { parseIdentifier } from './parseIdentifier'
import { parseOperator } from './parseOperator'
import { parseValue } from './parseValue'
import { parseRaw } from './parseRaw'
import { parseOperation } from './parseOperation'

export function parseFilter(args, opts) {
  opts = defaultOptions(opts)

  if (args.length === 1) {
    return parseOneArg(args, opts)
  } else if (args.length === 2) {
    return parseTwoArg(args, opts)
  } else if (args.length === 3) {
    return parseThreeArg(args, opts)
  }

  throw createError(args, opts)
}

function defaultOptions(opts) {
  return Object.assign(
    {
      lhsIsIdentifier: true,
      rhsIsIdentifier: false,
    },
    opts
  )
}

function parseOneArg(args, opts) {
  const arg = args[0]

  if (isFunction(arg)) {
    return parseCallback(arg, opts)
  } else if (isBoolean(arg)) {
    return parseBoolean(arg, opts)
  } else if (isOperation(arg)) {
    return parseOperationItem(arg, opts)
  } else if (isPlainObject(arg)) {
    return parsePlainObject(arg, opts)
  }

  throw createError(args, opts)
}

function parseCallback(arg, opts) {
  let nodes = []
  let subBuilder = new opts.queryBuilderClass(opts)

  subBuilder = arg.call(subBuilder, subBuilder) || subBuilder
  subBuilder.operationNode.visitAllChildren({
    visitFilterNode(node) {
      nodes.push(node)
    },
  })

  if (nodes.length === 0) {
    return []
  } else {
    return [new FilterGroupNode(nodes, opts.bool, opts.not)]
  }
}

function parseBoolean(arg, opts) {
  return [
    new opts.NodeClass(
      parseValue(arg ? 1 : 0, opts),
      parseOperator('='),
      parseValue(1, opts),
      opts.bool,
      opts.not
    ),
  ]
}

function parseOperationItem(arg, opts) {
  return [new opts.NodeClass(parseOperation(arg), null, null, opts.bool, opts.not)]
}

function parsePlainObject(arg, opts) {
  let keys = Object.keys(arg)
  let nodes = []

  for (let i = 0, l = keys.length; i < l; ++i) {
    const key = keys[i]
    const val = arg[key]

    nodes = [...nodes, ...parseTwoArg([key, val], opts)]
  }

  if (opts.bool === Bool.Or) {
    return [
      new FilterGroupNode(
        nodes.map((it) => {
          it.bool = Bool.And
          return it
        }),
        opts.bool,
        opts.not
      ),
    ]
  } else {
    return nodes
  }
}

function parseTwoArg(args, opts) {
  let [lhs, rhs] = args
  return parseThreeArg([lhs, rhs === null ? 'is' : '=', rhs], opts)
}

function parseThreeArg(args, opts) {
  let [lhs, op, rhs] = args
  op = op.toLowerCase().trim()

  if (isEmptyWhereIn(op, rhs)) {
    return parseEmptyWhereIn(lhs, op, rhs, opts)
  }

  return [
    new opts.NodeClass(
      parseLhs(lhs, opts),
      parseOperator(op, opts),
      parseRhs(rhs, op, opts),
      opts.bool,
      opts.not
    ),
  ]
}

function parseLhs(arg, opts) {
  if (arg === null) {
    return null
  }

  if (opts.lhsIsIdentifier) {
    return parseIdentifier(arg, opts)
  } else {
    return parseValue(arg, opts)
  }
}

function parseRhs(arg, op, opts) {
  const isIn = isInOperator(op)
  const isBetween = isBetweenOperator(op)
  const parser = opts.rhsIsIdentifier ? parseIdentifier : parseValue

  // No matter what, number and boolean are parsed as values.
  if (isBoolean(arg) || isNumber(arg)) {
    return parseValue(arg, opts)
  } else if (Array.isArray(arg) && (isIn || isBetween)) {
    const nodes = arg.map((it) => parser(it, opts))

    if (isIn) {
      return new ValueListNode(nodes)
    } else if (isBetween) {
      return new ValueRangeNode(nodes[0], nodes[1])
    } else {
      return new ListNode(nodes)
    }
  } else {
    return parser(arg, opts)
  }
}

function parseEmptyWhereIn(lhs, op, rhs, opts) {
  // knex quirk: empty in-filter is interpreted as 1 = 0.
  return [
    new opts.NodeClass(
      parseRaw('1'),
      parseOperator('='),
      parseValue(opts.not === (op === 'in') ? 1 : 0, opts),
      opts.bool,
      false
    ),
  ]
}

function isEmptyWhereIn(op, rhs) {
  return isInOperator(op) && Array.isArray(rhs) && rhs.length === 0
}

function isInOperator(op) {
  return op === 'in' || op === 'not in'
}

function isBetweenOperator(op) {
  return op === 'between' || op === 'not between'
}

function createError(args, opts) {
  return new Error(`invalid ${opts.NodeClass.name} call with arguments ${JSON.stringify(args)}`)
}
