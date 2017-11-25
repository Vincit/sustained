class QueryCompilationResult {
  constructor(sql, bindings) {
    this.sql = sql;
    this.bindings = bindings;
  }
}

module.exports = {
  QueryCompilationResult
};
