/**
 * Test dependencies.
 */

const test = require('tape')
const robac = require('..')
const {join} = require('path')
const jsonwebtoken = require('jsonwebtoken')

test('should return a middleware function', assert => {
  assert.plan(1)
  assert.equal(typeof robac(), 'function')
})

test('should parse folder and generate pathnames', assert => {
  assert.plan(3)
  const handler = robac(join(__dirname, 'pages'))
  assert.equal(!!handler['/'], true)
  assert.equal(!!handler['/a'], true)
  assert.equal(!!handler['/b'], true)
})

test('should attach roles.json to pathname', assert => {
  assert.plan(3)
  const handler = robac(join(__dirname, 'pages'))
  assert.deepEqual(handler['/'], {})
  assert.deepEqual(handler['/b'], {
    roles: ['admin', 'super']
  })
  assert.deepEqual(handler['/a'], {})
})

test('should execute callback only if authorization header but pathname does not have roles', assert => {
  assert.plan(1)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  const req = {
    url: '/c',
    headers: {
      authorization: `Bearer ${token()}`
    }
  }
  handler(req, () => assert.ok('success'), 'thisisasecret')
})

// test('should execute callback only if authorization header contains allowed role', assert => {
//   assert.plan(1)
//   const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
//   const req = {
//     url: '/b',
//     headers: {
//       authorization: `Bearer ${token()}`
//     }
//   }
//   handler(req, () => assert.ok('success'), 'thisisasecret')
// })

/**
 * Generate test token.
 *
 * @return {String}
 * @api private
 */

function token () {
  return jsonwebtoken.sign({
    roles: ['super']
  }, 'thisisasecret')
}
