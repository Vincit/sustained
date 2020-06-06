/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { OperationBuilder } from '../operations/builders/OperationBuilder'
import { OperationNode } from '../operations/nodes/OperationNode'

export function isPlainObject(val: any): boolean {
  return isObject(val) && (!val.constructor || val.constructor === Object)
}

export function isObject(val: any): boolean {
  return val !== null && typeof val === 'object'
}

export function isArray(val: any): val is Array<any> {
  return Array.isArray(val)
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function isFunction(val: any): val is CallableFunction {
  return typeof val === 'function'
}

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean'
}

export function isNumber(val: any): val is number {
  return typeof val === 'number'
}

export function isPrimitive(val: any): val is number | boolean | string | undefined {
  return typeof val !== 'object'
}

export function isNull(val: any): val is null {
  return val === null
}

export function isUndefined(val: any): val is undefined {
  return val === undefined
}

export function isDate(val: any): val is Date {
  return val instanceof Date
}

export function isOperation(val: any): val is OperationNode | OperationBuilder {
  return isOperationBuilder(val) || isOperationNode(val)
}

export function isOperationBuilder(val: any): val is OperationBuilder {
  return isObject(val) && val.isSustainedOperationBuilder
}

export function isOperationNode(val: any): val is OperationNode {
  return isObject(val) && val.isSustainedOperationNode
}
