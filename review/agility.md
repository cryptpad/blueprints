---
title: Towards More Cryptographic Agility
tags: review
---

# Towards More Cryptographic Agility

## Abstract

CryptPad currently uses hard coded algorithms for encrypting documents and messages.
Changing such an algorithm requires the introduction of a new ciphertext type and poses a major effort on the development side.

While the currently used algorithms are still considered to be secure, the wide-spoken threat of quantum cryptography potentially endangers the security of CryptPad.
Even tough there is no post-quantum public key encryption scheme standardized by \acs{NIST}, it is proposed to already think ahead and plan the transition towards such a scheme.
We thus show the algorithms used in CryptPad and discuss their safety against quantum computer attacks.
In such a process it is key to plan it with cryptographic agility in mind.
We therefore outline the path towards more easily swappable cryptographic algorithms in CryptPad.

## 👉 [PDF](./main.pdf)
