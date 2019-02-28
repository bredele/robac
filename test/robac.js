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

test('should parse folder and generate pathnames with roles', assert => {
  assert.plan(4)
  const handler = robac(join(__dirname, 'pages'))
  assert.equal(handler['/'] == null, true)
  assert.equal(handler['/a'] == null, true)
  assert.equal(!!handler['/b'], true)
  assert.equal(!!handler['/d'], true)
})

test('should attach roles.json to pathname', assert => {
  assert.plan(1)
  const handler = robac(join(__dirname, 'pages'))
  assert.deepEqual(handler['/b'], {
    roles: ['admin', 'super']
  })
})

test('should execute callback if path does not exist', assert => {
  assert.plan(1)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  handler(request('/c'), err => {
    assert.equal(err == null, true)
  })
})

test('should execute callback if path exists but json roles not specified', assert => {
  assert.plan(1)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  handler(request('/'), err => {
    assert.equal(err == null, true)
  })
})

test('should execute callback if json roles exists but roles not specified', assert => {
  assert.plan(3)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  handler(request('/d'), (err, roles, json) => {
    assert.equal(err == null, true)
    assert.deepEqual(json, {meta: 'data'})
    assert.deepEqual(roles, [])
  })
})

test('should pass error when token can not be decoded', assert => {
  assert.plan(3)
  const handler = robac(join(__dirname, 'pages'), 'what')
  handler(request('/b'), (err, roles, json) => {
    assert.equal(err != null, true)
    assert.equal(roles == null, true)
    assert.deepEqual(json, {roles: ['admin', 'super']})
  })
})

test('should pass error when role(s) has to be specified but token not present', assert => {
  assert.plan(4)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  handler({
    url: '/b',
    headers: {}
  }, (err, roles, json) => {
    assert.equal(err != null, true)
    assert.equal(err.message, 'Token not specified')
    assert.equal(roles == null, true)
    assert.deepEqual(json, {roles: ['admin', 'super']})
  })
})

test('should pass error when roles do not match', assert => {
  assert.plan(4)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  handler(request('/b', () => {}, ['hello']), (err, roles, json) => {
    assert.equal(err != null, true)
    assert.equal(err.message, 'No role(s) match')
    assert.deepEqual(roles, [])
    assert.deepEqual(json, {roles: ['admin', 'super']})
  })
})

test('should pass roles when match', assert => {
  assert.plan(3)
  const handler = robac(join(__dirname, 'pages'), 'thisisasecret')
  handler(request('/b', () => {}), (err, roles, json) => {
    assert.equal(err == null, true)
    assert.deepEqual(roles, ['super'])
    assert.deepEqual(json, {roles: ['admin', 'super']})
  })
})

/**
 * Mock HttpRequest object.
 *
 * @param {String} pathname
 * @param {Function} spy
 * @return {Object}
 * @api private
 */

function request (pathname, spy = () => {}, roles) {
  return {
    url: pathname,
    headers: new Proxy({}, {
      get (target, key) {
        spy()
        return `Bearer ${token(roles)}`
      }
    })
  }
}

/**
 * Generate test token.
 *
 * @return {String}
 * @api private
 */

function token (roles = ['super']) {
  return jsonwebtoken.sign({
    roles
  }, 'thisisasecret')
}
