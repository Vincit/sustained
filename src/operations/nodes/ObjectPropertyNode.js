import { OperationNode } from './OperationNode'

class ObjectPropertyNode extends OperationNode {
  constructor(key, value) {
    super()

    this.key = key
    this.value = value
  }
}

export { ObjectPropertyNode }
