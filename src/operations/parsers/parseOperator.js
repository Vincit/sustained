import { OperatorNode } from '../nodes'
import { isString, isOperation } from '../../utils/typeUtils'
import { parseOperation } from './parseOperation'

export function parseOperator(operator) {
  if (isOperation(operator)) {
    return parseOperation(operator)
  } else if (isString(operator)) {
    return new OperatorNode(operator.toLowerCase().trim())
  } else {
    throw new Error(`invalid operator ${operator}`)
  }
}
