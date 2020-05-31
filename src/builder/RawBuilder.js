import { RawAstBuilder } from '../ast/builders/RawAstBuilder'
import { Executable } from './Executable'

export class RawBuilder extends Executable(RawAstBuilder) {}

export function raw(sql, ...bindings) {
  return new RawBuilder({
    sql,
    bindings,
  })
}
