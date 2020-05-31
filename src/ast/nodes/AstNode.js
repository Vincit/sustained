import { isDate, isAstNode, isObject } from '../../utils/typeUtils'

export class AstNode {
  constructor() {
    this.type = this.constructor.name
  }

  visit(visitor, ...args) {
    let constructor = this.constructor
    let visit = undefined

    while (constructor && visit === undefined) {
      const visitMethodName = 'visit' + constructor.name;
      visit = visitor[visitMethodName]
      constructor = constructor.__proto__
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

  visitAllChildren(visitor, ...args) {
    return visitAllChildren(this, visitor, args)
  }

  clone() {
    return clone(this)
  }
}

function visitAllChildren(node, visitor, args) {
  const props = Object.keys(node)

  for (let i = 0, l = props.length; i < l; ++i) {
    const prop = props[i]
    const value = node[prop]

    if (Array.isArray(value)) {
      visitArray(value, visitor, args)
    } else if (isAstNode(value)) {
      value.visit(visitor, ...args)
    }
  }
}

function visitArray(arr, visitor, args) {
  for (let i = 0, l = arr.length; i < l; ++i) {
    const item = arr[i]

    if (isAstNode(item)) {
      item.visit(visitor, ...args)
    }
  }
}

function clone(node) {
  const copy = new node.constructor();
  const props = Object.keys(node)

  for (let i = 0, lp = props.length; i < lp; ++i) {
    const prop = props[i]
    copy[prop] = cloneValue(node[prop])
  }

  return copy
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return cloneArray(value)
  } else if (isAstNode(value)) {
    return value.clone()
  } else if (isDate(value)) {
    return new Date(value)
  } else if (isObject(value)) {
    return Object.assign({}, value)
  } else {
    return value
  }
}

function cloneArray(arr) {
  const newArr = new Array(arr.length)

  for (let i = 0, l = arr.length; i < l; ++i) {
    newArr[i] = cloneValue(arr[i])
  }

  return newArr
}

Object.defineProperties(AstNode.prototype, {
  isSustainedAstNode: {
    enumerable: false,
    value: true,
  },
})
