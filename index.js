/**
 * Dependencies.
 */

const fs = require('fs')
const {join} = require('path')
const jsonwebtoken = require('jsonwebtoken')
const {parse} = require('url')

module.exports = (folder, secret) => {
  const tree = (req, handler) => {
    const pathname = parse(req.url).pathname
    const token = authorization(req)

    if (!tree[pathname]) handler()
    else {
      if (token) {
        jsonwebtoken.verify(token, secret, function(err, decoded) {
          console.log('decoded', err, decoded)
        })
      }
    }
  }
  if (folder) tree['/'] = roles(folder)
  return walk(folder, folder, tree)
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
  } catch (e) {}
  return obj
}
