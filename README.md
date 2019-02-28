# Robac

  > [![Build Status](https://travis-ci.org/bredele/robac.svg?branch=master)](https://travis-ci.org/bredele/robac)
  [![NPM](https://img.shields.io/npm/v/robac.svg)](https://www.npmjs.com/package/robac)
  [![Downloads](https://img.shields.io/npm/dm/robac.svg)](http://npm-stat.com/charts.html?package=robac)
  [![pledge](https://bredele.github.io/contributing-guide/community-pledge.svg)](https://github.com/bredele/contributing-guide/blob/master/community.md)

**Ro**les **ba**sed **a**ccess **c**ontrol for HTTP servers using JWT authorization.


## Usage

```js
const http = require('http')
const roles = require('robac')

// parse folder and look for roles.json files
const handler = roles(__dirname)

http.createServer((req, res) => {
  // get pathname and look for roles
  // use JWT secret and authorization header
  handler(req, () => {
    // do something if access to path
  })
})
```

## Installation

```shell
npm install robac --save
```

[![NPM](https://nodei.co/npm/robac.png)](https://nodei.co/npm/robac/)


## Question

For questions and feedback please use the [Gitter chat room](https://gitter.im/robacjs/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link) or our [twitter account](https://twitter.com/bredeleca). For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/bredele/contributing-guide/blob/master/community.md" target="_blank">community guideline</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## License

The MIT License (MIT)

Copyright (c) 2016 Olivier Wietrich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
