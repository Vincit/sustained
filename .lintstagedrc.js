module.exports = {
  '**/*.ts': [
    () => 'tsc --noEmit',
    'eslint --max-warnings=0'
  ]
}
