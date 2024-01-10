---
title: Update TweetNaCl
term: short
tags: roadmap
id: TweetNaCl
link-to: async-crypto
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

CryptPad uses TweetNaCl[^1] version 0.12.2
(September 18, 2014) while the newest version is 1.0.3 (February 10,
2020).

### Consequences:

CryptPad misses optimizations and security fixes introduced in later
versions. In the current version, `nacl.sign` or `nacl.sign.detached`
could create incorrect signatures. Moreover, CryptPad it might be hard
to update TweetNaCl in case of a severe security issue.

### Suggestions:

Update TweetNaCl to the latest version.

### Drawbacks:

TweetNaCl has refactored some of the utilities into a separate library
and now properly validates the base64 padding before decoding. An update
therefore requires significant work.


[^1]: Bernstein, Daniel J., Bernard van Gastel, Wesley Janssen, Tanja Lange, Peter Schwabe, and Sjaak Smetsers. 2014. “TweetNaCl: A Crypto Library in 100 Tweets.” In *Progress in Cryptology - LATINCRYPT*, edited by Diego F. Aranha and Alfred Menezes, 64–83. Cham: Springer International Publishing.  
Chestnykhm, Dmitry, Devi Mandiri, and AndSDev. 2016-. “TweetNaCl.js.” https://github.com/dchest/tweetnacl-js.