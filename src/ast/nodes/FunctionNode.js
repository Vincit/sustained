import { AstNode } from './AstNode'

class FunctionNode extends AstNode {
  constructor(name, modifiers, args) {
    super()

    this.name = name
    this.modifiers = modifiers
    this.args = args
  }
}

export { FunctionNode }
