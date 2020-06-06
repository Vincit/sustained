import { RawOperationBuilder } from '../operations/builders/RawOperationBuilder'
import { Executable } from './Executable'

export class RawBuilder extends Executable(RawOperationBuilder) {}

export function raw(sql, ...bindings) {
  return new RawBuilder({
    sql,
    bindings,
  })
}
