/**
 * Example dependencies
 */

const {join} = require('path')
const http = require('http')
const roles = require('..')

/**
 * Parse pages folder and create middleware.
 * Only path /b has specific roles.
 */

const handler = roles(join(__dirname, 'pages'), 'thisisasecret')


/**
 * Create HTTP server.
 */

http.createServer((req, res => {
  handler(req, (err) => {
    if (err) console.log('not authorized')
    else console.log('authorized')
    res.end()
  })
}).listen(5050)
