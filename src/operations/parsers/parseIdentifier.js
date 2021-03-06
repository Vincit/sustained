import { IdentifierNode } from '../nodes'
import { isString, isOperation } from '../../utils/typeUtils'
import { parseOperation } from './parseOperation'

const ALIAS_OPTIONS = {
  dontSplitOnDots: true,
}

export function parseIdentifier(identifier, opts) {
  if (isOperation(identifier)) {
    return parseOperation(identifier)
  } else if (isString(identifier)) {
    if (opts && opts.dontSplitOnDots) {
      return new IdentifierNode([identifier])
    } else {
      return new IdentifierNode(identifier.split('.'))
    }
  } else {
    throw new Error(`invalid identifier ${JSON.stringify(identifier, null, 2)}`)
  }
}

export function parseAlias(alias) {
  return parseIdentifier(alias, ALIAS_OPTIONS)
}

export function parseIdentifierWithAlias(identifier) {
  if (isString(identifier)) {
    const parts = identifier.split(/\sas\s/i)

    if (parts.length === 2) {
      return [parseIdentifier(parts[0]), parseAlias(parts[1])]
    } else {
      return [parseIdentifier(identifier), null]
    }
  } else {
    return [parseIdentifier(identifier), null]
  }
}
