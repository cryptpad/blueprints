---
title: Deduplicate Code
term: medium
tags: roadmap
id: dedup-viewcryptor
author: Theo von Arx, Aaron MacSween
date: 2023-03-14
---


### Problem:

The functions
[`createViewCryptor2`](https://github.com/cryptpad/chainpad-crypto/blob/c8b76b895f67719a3b799daac3d832fdfea45613/crypto.js#L191)
and
[`createFileCryptor2`](https://github.com/cryptpad/chainpad-crypto/blob/c8b76b895f67719a3b799daac3d832fdfea45613/crypto.js#L276)
essentially provide the same functionality: provide a read-only access
to a document.

### Consequences:

It is harder to understand and maintain what the two functions do.

### Suggestions:

Merge the two functions and make them callable with and without a .

### Drawbacks:

The of `createViewCryptor2` is 16 bytes long, while the one of
`createFileCryptor2` has 24 bytes. Furthermore, `createFileCryptor2`
does not use the secondary signing key pair that is produced by
`createViewCryptor2`.
