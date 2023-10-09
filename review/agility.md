---
title: Towards More Cryptographic Agility
tags: review
---

## Abstract

CryptPad currently uses hard coded algorithms for encrypting documents and messages.
Changing such an algorithm requires the introduction of a new ciphertext type and poses a major effort on the development side.

While the currently used algorithms are still considered to be secure, the wide-spoken threat of quantum cryptography potentially endangers the security of CryptPad.
As the first standard for post-quantum public key encryption scheme has been
announced by <abbr title="National Institute of Standards and
Technology">NIST</abbr>, we thus plan the transition towards such a scheme.
With this aim in mind, we present the different cryptographic primitives used in
CryptPad and explore their safety against a quantum adversary.
In such a process, it is key to plan it with cryptographic agility in mind.
We henceforth outline the path towards more easily swappable cryptographic
algorithms in CryptPad.

## 👉 [PDF](./main.pdf)
