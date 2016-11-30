const crypto = require('crypto')
const multihashes = require('multihashes')
const canonicalStringify = require('canonical-json')

const cryptoMultihashMapping = {
		sha224: "sha2-224",
		sha512: "sha2-512",
		sha256: "sha2-256"
		// TODO figure out more complete mapping
}

const multihashCryptoMapping = Object
	.keys(cryptoMultihashMapping)
	.reduce(function (acc,key) {
  	acc[cryptoMultihashMapping[key]] = key;
   return acc;
	}, {})

// find element or throw
const lookup = function (dictionary, key) {
	const v = dictionary[key]
	if (!v) {
		throw new Error('unmapped hash function, see https://github.com/multiformats/multihash/issues/58')
	}
	return v
}

// convert node 'crypto.createHash' label to `multihash` label
const mfMap = hashFunc => lookup(cryptoMultihashMapping, hashFunc)
const cfMap = hashFunc => lookup(multihashCryptoMapping, hashFunc)

function encode (message, hashFunc) {
	const cstr = canonicalStringify(message)
	const cobj = JSON.parse(cstr)
	const cbuf = new Buffer(cstr, 'utf-8') // TODO write unit tests

	const hf = hashFunc || 'sha256'
	const hash = crypto.createHash(hf)
	hash.update(cbuf)

	const mhbuf = multihashes.encode(hash.digest(), mfMap(hf))
	return {
		message: cobj,
		multihash: mhbuf.toString('base64')
	}
}

function validate (envelope) {
	// canonicalize JSON message into a buffer
	const cstr = canonicalStringify(envelope.message)
	const cobj = JSON.parse(cstr)
	const cbuf = new Buffer(cstr, 'utf-8') // TODO write unit tests

	// decode multihash and find corresponding `crypto` hashfn
	const mhbuf = new Buffer(envelope.multihash, 'base64')
	const m = multihashes.decode(mhbuf)
	const hf = cfMap(m.name)

	// recompute correct hash
	const hash = crypto.createHash(hf)
	hash.update(cbuf)
	const d1 = m.digest.toString('hex')
	const d2 = hash.digest('hex')

	return d1 === d2
}

exports.wrap = encode
exports.verify = validate
