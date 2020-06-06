import { OperationNode } from './OperationNode'

export class BindingNode extends OperationNode {
  match: string
  index: number
  node: OperationNode

  constructor(match: string, index: number, node: OperationNode) {
    super()

    this.match = match
    this.index = index
    this.node = node
  }
}
