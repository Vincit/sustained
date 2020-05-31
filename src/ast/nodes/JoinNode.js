import { AstNode } from './AstNode'

class JoinNode extends AstNode {
  constructor(joinType, target, on, using) {
    super()

    this.joinType = joinType || null
    this.target = target || null
    this.on = on || []
    this.using = using || []
  }
}

export { JoinNode }