import { OperationNode } from './OperationNode'

class ObjectNode extends OperationNode {
  constructor(propeties) {
    super()
    this.properties = propeties
  }
}

export { ObjectNode }
