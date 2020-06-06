import { OperationNode } from './OperationNode'

class JoinNode extends OperationNode {
  constructor(joinType, target, on, using) {
    super()

    this.joinType = joinType || null
    this.target = target || null
    this.on = on || []
    this.using = using || []
  }
}

export { JoinNode }
