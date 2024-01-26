---
title: Cryptography Libraries for CryptPad
pdf: ../main.pdf
pdfpath: ../_assets/review/libraries/main.pdf
---


Changing the cryptographic primitives in CryptPad is complex and requires a lot
of work to maintain backwards compatibility. For this reason, a possibly new
cryptography library has to be chosen carefully.

Since its beginning, CryptPad has used the TweetNaCl-JS library to perform
cryptographic operations. We re-evaluate it in terms of security and
performance. We furthermore compare it against other popular libraries/APIs such
as Libsodium.js and the Web Crypto API.

While NaCl is still considered to be secure and there are no known attacks, it
lacks performance and native support on current browsers. Sodium provides more
flexibility in terms of available algorithms (which are not necessarily desired
for CryptPad). SubtleCrypto provides highly performant primitives, which differ
from CryptPad's used algorithms. The performance gain is most-likely not big
enough to justify the workload on adapting these algorithms immediately, but
only when a bigger refactoring happens anyway.

**The benchmark suite for testing the performance of various libraries is in
[`performance`](../performance/).**

## [PDF]({{ pdf | url }})
