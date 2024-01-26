---
layout: layouts/base
title: "Review of the State of the Art in Applied Cryptography"
eleventyNavigation:
  title: Review
  order: 2
---

We review the cryptography used in CryptPad and compare it against the state of
the art in applied cryptography. For this, we evaluate the security of
third-party libraries, and [benchmark](./libraries/#performance-comparison) their
performance. We summarize our findings in a detailed [comparison of cryptography
libraries](libraries/).

We further re-think CryptPad's architecture to change from static, hard-coded
algorithms towards more [cryptographic agility](agility/). This allows us to
update vulnerable algorithms and to adjust parameters more easily in the future.
Importantly, we can start to prepare the security of CryptPad in a post-quantum
world. We setup criteria for when and how to change towards post-quantum
ciphers.

