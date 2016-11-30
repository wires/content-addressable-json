# Content Addressable JSON

Give JSON value a hash based on it's logical content.

Example

```
const caddr = require('content-addressable-json')
const example = { a: 1, b: [2,3,[]] }
console.log(caddr(example))
```

Result

```js
{ message: { a: 1, b: [ 2, 3, [] ] },
  multihash: '12202877ff7d82711e7c3af1fc09b76058e28c3298002ef4f6794710994d8e1f2d2f' }
```

Ordering of map elements doesn't change the hash value as the "logical content"
didn't change.

```js
const h1 = caddr({ b: [2,3,[]], a: 1 })
const h2 = caddr({ a: 1, b: [2,3,[]] })
console.log(h1.multihash === h2.multihash) // => true
```
