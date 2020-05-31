import { AstNode } from './AstNode'

class ObjectPropertyNode extends AstNode {
  constructor(key, value) {
    super()

    this.key = key
    this.value = value
  }
}

export { ObjectPropertyNode }
