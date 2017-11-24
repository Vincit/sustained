# Experimental knex.js clone with emphasis on reflection and malleability

This repository exists only for testing out ideas. The goal is to eventually get this stuff merged with knex if possible. We don't want to create a competing library. The code is published for collaboration purposes only.

## Goals

* Maximum separation of concerns
* Each part of of the codebase is designed to be overridable using standard inheritance
* QueryBuilder builds a documented AST tree that can be inspected and transformed by the user before compilation to SQL.
* Adding new third party plugins, drivers, pools and dialects will be made super easy

DON'T USE THIS IN PRODUCTION! Not that you even could for a long time :D
