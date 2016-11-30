const wrap = require('./index.js').wrap
const verify = require('./index.js').verify

const example = { a: 1, b: [2,3,[]] }
const example2 = { b: [2,3,[]], a: 1 }

const v1 = wrap(example)
const v2 = wrap(example2)
console.log(v1, v2)

console.log(verify(v1))
console.log(verify(v2))
