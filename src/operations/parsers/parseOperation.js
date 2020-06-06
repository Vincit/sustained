import { isOperationNode, isOperationBuilder } from '../../utils/typeUtils'

export function parseOperation(val) {
  if (isOperationNode(val)) {
    return val.clone()
  } else if (isOperationBuilder(val)) {
    return val.operationNode.clone()
  } else {
    throw new Error('Not an operation node')
  }
}
