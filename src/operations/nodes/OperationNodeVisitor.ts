import {
  AliasableNode,
  OperationNode,
  BindingNode,
  FilterNode,
  InsertNode,
  FilterGroupNode,
  FromNode,
  FunctionNode,
  GroupByNode,
  HavingNode,
  IdentifierNode,
  JoinNode,
  JoinOnNode,
  ListNode,
  ObjectNode,
  ObjectPropertyNode,
  OperatorNode,
  OrderByNode,
  QueryNode,
  RawNode,
  ReturningNode,
  SelectNode,
  UpdateNode,
  ValueListNode,
  ValueNode,
  ValueRangeNode,
  WhereNode,
  WithNode,
} from '.'

export interface OperationNodeVisitor {
  visitAliasableNode?(node: AliasableNode, ...args: any[]): OperationNode | undefined
  visitOperationNode?(node: OperationNode, ...args: any[]): OperationNode | undefined
  visitBindingNode?(node: BindingNode, ...args: any[]): OperationNode | undefined
  visitFilterGroupNode?(node: FilterGroupNode, ...args: any[]): OperationNode | undefined
  visitFilterNode?(node: FilterNode, ...args: any[]): OperationNode | undefined
  visitFromNode?(node: FromNode, ...args: any[]): OperationNode | undefined
  visitFunctionNode?(node: FunctionNode, ...args: any[]): OperationNode | undefined
  visitGroupByNode?(node: GroupByNode, ...args: any[]): OperationNode | undefined
  visitHavingNode?(node: HavingNode, ...args: any[]): OperationNode | undefined
  visitIdentifierNode?(node: IdentifierNode, ...args: any[]): OperationNode | undefined
  visitInsertNode?(node: InsertNode, ...args: any[]): OperationNode | undefined
  visitJoinNode?(node: JoinNode, ...args: any[]): OperationNode | undefined
  visitJoinOnNode?(node: JoinOnNode, ...args: any[]): OperationNode | undefined
  visitListNode?(node: ListNode<OperationNode>, ...args: any[]): OperationNode | undefined
  visitObjectNode?(node: ObjectNode, ...args: any[]): OperationNode | undefined
  visitObjectPropertyNode?(node: ObjectPropertyNode, ...args: any[]): OperationNode | undefined
  visitOperatorNode?(node: OperatorNode, ...args: any[]): OperationNode | undefined
  visitOrderByNode?(node: OrderByNode, ...args: any[]): OperationNode | undefined
  visitQueryNode?(node: QueryNode, ...args: any[]): OperationNode | undefined
  visitRawNode?(node: RawNode, ...args: any[]): OperationNode | undefined
  visitReturningNode?(node: ReturningNode, ...args: any[]): OperationNode | undefined
  visitSelectNode?(node: SelectNode, ...args: any[]): OperationNode | undefined
  visitUpdateNode?(node: UpdateNode, ...args: any[]): OperationNode | undefined
  visitValueListNode(node: ValueListNode, ...args: any[]): OperationNode | undefined
  visitValueNode(node: ValueNode, ...args: any[]): OperationNode | undefined
  visitValueRangeNode(node: ValueRangeNode, ...args: any[]): OperationNode | undefined
  visitWhereNode(node: WhereNode, ...args: any[]): OperationNode | undefined
  visitWithNode(node: WithNode, ...args: any[]): OperationNode | undefined
}
