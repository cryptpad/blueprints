---
title: Fix Bit Overlap in ViewCryptor2
tags: roadmap
id: bit-overlap
linkto: [dedup-viewcryptor]
author: Theo von Arx, Aaron MacSween
date: 2023-03-14
term: medium
---

### Problem:

In the function
[`createViewCryptor2`](https://github.com/cryptpad/chainpad-crypto/blob/c8b76b895f67719a3b799daac3d832fdfea45613/crypto.js#L206-L214),
there is an overlap of 128 bit when generating a symmetric key and a signing key
pair.

### Consequences:

An adversary having only access to one of the keys has better chances to
guess the other one. Since there are still 128 independent bits, the
vulnerability is not considered severe, but should be fixed in a future
version.

### Suggestions:

There are several ways to resolve this issue:

1. Increase the size of the seed to have enough bits to make the keys
   independent.
2. Hash bytes 16 to 64 to get again a string of 64 bytes.
3. Use a [consumer-based programming
   pattern](https://github.com/cryptpad/blueprints/blob/main/document/recommendations/prng.js)
   (similarly as it is already done for [the
   credentials](https://github.com/cryptpad/cryptpad/blob/ce56447031c7644d87d802d5f5b22afbc7b7b923/www/common/common-credential.js#L50-L86))
   that can produce “infinitely” many pseudo-random bytes. This essentially
   hinders us from making such mistakes in the futures.

### Drawbacks:

This requires to introduce a new version of encryption while keeping the
old one for backwards compatibility.
