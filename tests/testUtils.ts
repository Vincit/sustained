import chai from 'chai'
import chaiSubset from 'chai-subset'
import { QueryBuilder } from '../src'

chai.use(chaiSubset)

export function query(): QueryBuilder {
  return new QueryBuilder()
}

export const expect = chai.expect
