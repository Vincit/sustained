import { OperatorNode } from '../nodes'
import { isString, isAst } from '../../utils/typeUtils'
import { parseAst } from './parseAst'

export function parseOperator(operator) {
  if (isAst(operator)) {
    return parseAst(operator)
  } else if (isString(operator)) {
    return new OperatorNode(operator.toLowerCase().trim())
  } else {
    throw new Error(`invalid operator ${operator}`)
  }
}
