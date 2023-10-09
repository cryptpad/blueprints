---
layout: layouts/base
title: Review
eleventyNavigation:
  order: 2
---

# Review of the State of the Art in Applied Cryptography

We review the cryptography used in CryptPad and compare it against the state of
the art in applied cryptography. For this, we evaluate the security of
third-party libraries, and [benchmark](./libraries/performance) their
performance. We summarize our findings in a detailed
[comparison of cryptography libraries](libraries/main.pdf)

We further re-think CryptPad's architecture to change from static, hard-coded
algorithms towards more [cryptographic agility](agility/main.pdf). This allows
us to update vulnerable algorithms and to adjust parameters more easily in the
future. Importantly, we can start to prepare the security of CryptPad in a
post-quantum world. We setup criteria for when and how to change towards
post-quantum ciphers.

