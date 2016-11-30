# Content Addressable JSON

Give JSON value a hash based on it's logical content.

Example

```
const wrap = require('content-addressable-json').wrap
const example = { a: 1, b: [2,3,[]] }
console.log(wrap(example))
```

Result

```js
{ message: { a: 1, b: [ 2, 3, [] ] },
  multihash: '12202877ff7d827...2ef4f6794710994d8e1f2d2f' }
```

We can check the message content against the hash

```js
const wrap = require('content-addressable-json').wrap
const verify = require('content-addressable-json').verify
const example = { a: 1, b: [2,3,[]] }
console.log(verify(wrap(example))) // => true
```

Ordering of map elements doesn't change the hash value as the "logical content"
didn't change.

```js
const h1 = caddr({ b: [2,3,[]], a: 1 })
const h2 = caddr({ a: 1, b: [2,3,[]] })
console.log(h1.multihash.toString('hex') === h2.multihash.toString('hex'))
// => true
```
