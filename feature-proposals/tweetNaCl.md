---
title: Update TweetNaCl
tags: roadmap
id: twee
link-to: async
---

## Problem:

CryptPad uses TweetNaCl  version 0.12.2 (September 18, 2014) while the
newest version is 1.0.3 (February 10, 2020).

## Consequences:

CryptPad misses optimizations and security fixes introduced in later
versions. In the current version, `nacl.sign` or `nacl.sign.detached`
could create incorrect signatures. Moreover, CryptPad it might be hard
to update TweetNaCl in case of a severe security issue.

## Suggestions:

Update TweetNaCl to the latest version.

## Drawbacks:

TweetNaCl has refactored some of the utilities into a separate library
and now properly validates the base64 padding before decoding. An update
therefore requires significant work.
