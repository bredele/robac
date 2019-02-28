/**
 * Dependencies.
 */

const fs = require('fs')
const {join} = require('path')
const jsonwebtoken = require('jsonwebtoken')
const {parse} = require('url')

module.exports = (folder, secret) => {
  const tree = (req, handler) => {
    const json = tree[parse(req.url).pathname] || {}
    const allowed = json.roles
    if (allowed) {
      const token = authorization(req)
      if (token) {
        return jsonwebtoken.verify(token, secret, function(err, decoded) {
          if (err) return handler(err)
          else {
            console.log('allowed', allowed, decoded.roles)
            const roles = intersection(allowed, decoded.roles)
            return handler(roles.length < 1 ? new Error('No role(s) match') : null, roles, json)
          }
        })
      } else {
        return handler(new Error('Token not specified'))
      }
    }
    handler(null, [], json)
  }
  if (folder) tree['/'] = roles(folder)
  return walk(folder, folder, tree)
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
 * @api private
 */

function walk (root, folder, tree) {
  if (folder) {
    fs.readdirSync(folder).map(file => {
      const path = join(folder, file)
      if (fs.statSync(path).isDirectory()) {
        const pathname = path.substring(root.length)
        tree[pathname] = roles(path)
        walk(root, path, tree)
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

function roles (file) {
  let obj = {}
  try {
    obj = require(join(file, 'roles.json'))
  } catch (e) {
    obj = null
  }
  return obj
}
