import { ObjectNode, ObjectPropertyNode } from '../nodes'
import { parseIdentifier } from './parseIdentifier'
import { parseValue } from './parseValue'

export function parseIdValueObject(value, opts) {
  const keys = Object.keys(value)
  const properties = []

  for (let i = 0, l = keys.length; i < l; ++i) {
    const key = keys[i]
    const val = value[key]

    if (val !== undefined) {
      properties.push(new ObjectPropertyNode(parseIdentifier(key), parseValue(val, opts)))
    }
  }

  return new ObjectNode(properties)
}
