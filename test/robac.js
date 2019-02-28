/**
 * Test dependencies.
 */

const test = require('tape')
const robac = require('..')

test('should return a function', assert => {
  assert.plan(1)
  assert.equal(typeof robac(), 'function')
})
