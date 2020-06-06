import { OperationNode } from './OperationNode'

class RawNode extends OperationNode {
  constructor(sql, bindings) {
    super()

    this.sql = sql
    this.bindings = bindings
  }
}

export { RawNode }
