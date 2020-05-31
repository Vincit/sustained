import { QueryAstBuilder } from '../ast/builders/QueryAstBuilder'
import { Executable } from './Executable'

export class QueryBuilder extends Executable(QueryAstBuilder) {}
