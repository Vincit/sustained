import { OperationNode } from './OperationNode'

export class ListNode<NodeType extends OperationNode> extends OperationNode {
  items: NodeType[]

  constructor(items: NodeType[]) {
    super()
    this.items = items
  }
}
