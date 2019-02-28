# robac

Role based access control


```js
const http = require('http')
const robac = require('robac')

const handler = robac(__dirname)

http.createServer((req, res) => {
  handler(req, () => {
    // do something if access to path
  })
})

```
