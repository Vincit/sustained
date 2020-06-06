import { ListNode, FilterNode } from '.'

export class FilterGroupNode extends ListNode<FilterNode> {
  bool: string
  not: boolean

  constructor(items: FilterNode[], bool: string, not: boolean) {
    super(items)

    this.bool = bool
    this.not = not
  }
}
