const crypto = require('crypto')
const multihashes = require('multihashes')
const canonicalStringify = require('canonical-json')

const cryptoMultihashMapping = {
		sha224: "sha2-224",
		sha512: "sha2-512",
		sha256: "sha2-256"
		// TODO figure out more complete mapping
}

// convert node 'crypto.createHash' label to `multihash` label
const mfMap = function (hashFunc) {
	const m = cryptoMultihashMapping[hashFunc]
	if (!m) {
		throw new Error('unmapped hash function, see https://github.com/multiformats/multihash/issues/58')
	}
	return m
}

module.exports = function (message, hashFunc) {
	const hf = hashFunc || 'sha256'
	const hash = crypto.createHash(hf)
	const cstr = canonicalStringify(message)
	const cobj = JSON.parse(cstr)
	const cbuf = new Buffer(cstr, 'utf-8') // TODO write unit tests
	hash.update(cbuf)
	const mhbuf = multihashes.encode(hash.digest(), mfMap(hf))
	return {
		message: cobj,
		multihash: mhbuf.toString('hex')
	}
}
