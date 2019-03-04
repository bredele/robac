/**
 * Dependencies.
 */

const fs = require('fs')
const {join} = require('path')
const jsonwebtoken = require('jsonwebtoken')
const {parse} = require('url')
const cookie = require('cookie')

/**
 * Roles based access control middleware.
 *
 * @param {String} folder
 * @pram {String} secret
 * @return {Function}
 * @api public
 */

module.exports = (folder, secret) => {
  let options = typeof secret === 'string'
    ? {secret, namespace: 'roles'}
    : {...secret}
  /**
   * HTTP middleware.
   *
   * middleware pass wrror as first argument if roles do not match
   * or token can not be decoded.
   *
   * @param {HttpRequest} req
   * @param {Function} handler
   * @api public
   */

  const tree = (req, handler) => {
    const json = tree[parse(req.url).pathname] || {}
    const allowed = json.roles
    if (allowed) {
      const cookie = options.cookie
      const token = (cookie ? session(req, cookie) : null) || authorization(req)
      if (token) {
        return jsonwebtoken.verify(token, options.secret, function(err, decoded) {
          if (err) return handler(err, null, json)
          else {
            const roles = intersection(allowed, decoded.roles)
            return handler(roles.length < 1 ? new Error('No role(s) match') : null, roles, json)
          }
        })
      } else {
        return handler(new Error('Token not specified'), null, json)
      }
    }
    handler(null, [], json)
  }
  if (folder) tree['/'] = roles(folder, options.namespace)
  return walk(folder, folder, tree, options.namespace)
}

/**
 * Array intersection.
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 * @api private
 */

function intersection (a = [], b = []) {
  return a.filter(item => {
    return b.indexOf(item) > -1
  })
}

/**
 * Get authorization token.
 *
 * @param {Object} req
 * @api private
 */

function authorization (req) {
  const header = req.headers.authorization
  if (header) {
    const authorization = header.split(' ')
    if (authorization[0] === 'Bearer' && authorization.length === 2) return authorization[1]
  }
}

/**
 * Walk folder and add pathnames to object tree.
 *
 * @param {String} root
 * @param {String} folder
 * @param {Object} tree
 * @param {String} namespace
 * @api private
 */

function walk (root, folder, tree, namespace) {
  if (folder) {
    fs.readdirSync(folder).map(file => {
      const path = join(folder, file)
      if (fs.statSync(path).isDirectory()) {
        const pathname = path.substring(root.length)
        tree[pathname] = roles(path, namespace)
        walk(root, path, tree, namespace)
      }
    })
  }
  return tree
}

/**
 * Generate roles based on pathname and roles.json file.
 *
 * @param {String} file
 * @return {Object}
 * @api private
 */

function roles (file, namespace = 'roles') {
  let obj = {}
  try {
    obj = require(join(file, `${namespace}.json`))
  } catch (e) {
    obj = null
  }
  return obj
}

/**
 * Read cookie session.
 *
 * @param {Object} req
 * @param {String} key
 * @return {Object}
 * @api private
 */

function session (req, key) {
  const cookies = cookie.parse(req.headers.cookie)
  return cookies ? cookies[key] : null
}
