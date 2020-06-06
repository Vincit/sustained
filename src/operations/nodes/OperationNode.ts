import { isDate, isOperationNode, isObject } from '../../utils/typeUtils'
import { OperationNodeVisitor } from './OperationNodeVisitor'

export class OperationNode {
  type: string

  constructor() {
    this.type = this.constructor.name
  }

  visit(visitor: OperationNodeVisitor, ...args: any[]): OperationNode {
    let constructor = this.constructor
    let visit = undefined

    while (constructor && visit === undefined) {
      const visitMethodName = 'visit' + constructor.name
      visit = (visitor as any)[visitMethodName]
      constructor = Object.getPrototypeOf(constructor)
    }

    if (visit) {
      const result = visit.call(visitor, this, ...args)

      if (result === undefined) {
        return this
      } else {
        return result
      }
    }

    return this
  }

  visitAllChildren(visitor: OperationNodeVisitor, ...args: any[]): void {
    visitAllChildren(this, visitor, args)
  }

  clone(): this {
    return clone(this)
  }
}

function visitAllChildren(node: OperationNode, visitor: OperationNodeVisitor, args: any[]) {
  const props = Object.keys(node)

  for (let i = 0, l = props.length; i < l; ++i) {
    const prop = props[i]
    const value: any = (node as any)[prop]

    if (Array.isArray(value)) {
      visitArray(value, visitor, args)
    } else if (isOperationNode(value)) {
      value.visit(visitor, ...args)
    }
  }
}

function visitArray(arr: any[], visitor: OperationNodeVisitor, args: any[]) {
  for (let i = 0, l = arr.length; i < l; ++i) {
    const item = arr[i]

    if (isOperationNode(item)) {
      item.visit(visitor, ...args)
    }
  }
}

function clone(node: any): any {
  const copy = new node.constructor()
  const props = Object.keys(node)

  for (let i = 0, lp = props.length; i < lp; ++i) {
    const prop = props[i]
    copy[prop] = cloneValue(node[prop])
  }

  return copy
}

function cloneValue(value: any): any {
  if (Array.isArray(value)) {
    return cloneArray(value)
  } else if (isOperationNode(value)) {
    return value.clone()
  } else if (isDate(value)) {
    return new Date(value)
  } else if (isObject(value)) {
    return Object.assign({}, value)
  } else {
    return value
  }
}

function cloneArray(arr: any[]): any[] {
  const newArr = new Array(arr.length)

  for (let i = 0, l = arr.length; i < l; ++i) {
    newArr[i] = cloneValue(arr[i])
  }

  return newArr
}

Object.defineProperties(OperationNode.prototype, {
  isSustainedOperationNode: {
    enumerable: false,
    value: true,
  },
})
