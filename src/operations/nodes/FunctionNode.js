import { OperationNode } from './OperationNode'

class FunctionNode extends OperationNode {
  constructor(name, modifiers, args) {
    super()

    this.name = name
    this.modifiers = modifiers
    this.args = args
  }
}

export { FunctionNode }
