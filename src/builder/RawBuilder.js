import { RawAstBuilder } from '../ast/builders/RawAstBuilder'
import { Executable } from './Executable'

export class RawBuilder extends Executable(RawAstBuilder) {
  static create(...args) {
    return new this(...args)
  }
}

export function raw(sql, ...bindings) {
  return new RawBuilder({
    sql,
    bindings,
  })
}
