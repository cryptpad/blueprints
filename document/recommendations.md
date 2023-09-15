---
title: List of Security Recommendations for CryptPad
order: 3
tags: document
---

# List of Security Recommendations for CryptPad

During the writing of the cryptography white paper, we discovered multiple
issues and limitations in the current version of CryptPad. While none of them
are classified severe, requiring immediate action, or posing a serious threat
for users, they nevertheless should be addressed.

In this document, we list the problems, show their consequences, suggest how to
fix them and outline possible drawbacks. We classified them into three different
categories: short-term improvements that can be done immediately within the
current version of CryptPad, mid-term improvements that require the introduction
of a new version of the encryption schemes, and long-term improvements that can
only be addressed with architectural changes.

The file [`prng.js`](prng.js) sketches the idea of generating an "infinite"
stream of derived seeds.

## 👉 [PDF](./main.pdf)
