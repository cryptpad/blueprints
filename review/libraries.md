---
title: Comparison of Cryptography Libraries for CryptPad
pdf: /_assets/review/libraries/main.pdf
pdfpath: ../_assets/review/libraries/main.pdf
showtoc: True
author: Theo von Arx
date: 2022-12-15
---

## Abstract

Changing the cryptography primitives in CryptPad is complex and requires a lot of
work to maintain backwards compatibility.
For this reason, a possibly new cryptography library has to be chosen carefully.

Since its beginning, CryptPad uses the NaCl library to perform cryptographic operations.
We re-evaluate it in terms of security, performance and availability.
We furthermore compare it against other popular libraries/APIs such as Sodium
and the Web API SubtleCrypto.

While NaCl is still considered to be secure and there are no known attacks,
it lacks performance and native support on current browsers.
Sodium provides more flexibility in terms of available algorithms (which is
not necessarily desired for CryptPad).
SubtleCrypto provides highly performant primitives, which differ from CryptPad's
used algorithms.
The performance gain is most-likely not big enough to justify the workload on adapting
these algorithms.
What could be interesting is to replace NaCl's SHA-512 hash with SubtleCrypto's
SHA-512 since this maintains backwards compatibility.

## Notation

Some (informal) reminders about security notions:

* **INT-CTXT** (Ciphertext integrity):
  > Computationally infeasible to produce a decryptable
  > ciphertext not previously produced by the
  > sender, whether or not the underlying plaintext is "fresh"
* **IND-CPA** (Indistinguishability under Chosen-Plaintext Attack):
  > No adversary, given an encryption of a message randomly chosen from a
  > two-element message space determined by the adversary, can identify the
  > message choice with probability noticeably better than that of random
  > guessing (1⁄2)
* **SUF-CMA** (Strong Unforgeability against Chosen-Message Attack):
  > Adversary can't create a new tag for an existing message

## Problem statement

_If we deploy a new version of CryptPad's encryption layer, should we use
another library? And which?_

### Requirements

The following cryptographic functions are required:

* Key derivation function (KDF)
  * Brute-force resistant ⇒ Memory and time intense
  * Provide a good entropy
* Symmetric encryption, that provides
  * <abbr title="Authenticated Encryption with Associated Data">AEAD</abbr>
* Asymmetric encryption
  * IND-CPA
* Asymmetric signatures
  * Resistant to selective forgery in known-message attacks
  * SUF-CMA
* Hashes
  * Pre-image resistance
  * Collision resistance

Further requirements are:

* Javascript library
* Fast loadable
* Compatible with Firefox, Chrome, and Safari
* Fast (except for KDF)

## Libraries

### Tweet-NaCl

Tweet-NaCl is the library that is currently in use for CryptPad.

* [Article](https://tweetnacl.cr.yp.to/tweetnacl-20140917.pdf):
  * Title: TweetNaCl: A crypto library in 100 tweets.
  * Authors: D.J. Bernstein, B. van Gastel, W. Janssen, T. Lange, P. Schwabe and S. Smetsers.
  * In proceedings of LatinCrypt 2014.
* [Library](https://github.com/dchest/tweetnacl-js):
  * Written and maintained by [Dmitry Chestnykh](https://dchest.com/).
  * Last audit by Cure53 in 2017.
  * High-level API
  * 31 KB
    * License: [Unlicense License](https://en.wikipedia.org/wiki/Unlicense)
      (FSF approved and GPL compatible)
* Security:
  * Protects against simple timing attacks, cache-timing attacks, etc
  * Thread-safe, and has no dynamic memory allocation
  * Symmetric encryption: XSalsa20-Poly1305 which is AEAD
  * Asymmetric encryption: x25519-XSalsa20-Poly1305 which is AEAD
  * Asymmetric signatures: ed25519 which is AEAD
  * Hashing: SHA-512, [practical collision attacks against truncated SHA-512](https://eprint.iacr.org/2016/374.pdf),
    [approved by NIST](https://csrc.nist.gov/projects/hash-functions)
* Availability: as a client-side dependency

To sum up, Tweet-NaCl is considered to be secure and to meet CryptPad's requirements.
Hence, the only reason to change it would be performance (or quantum-resistant cryptography).

### LibSodium

* [Library](https://github.com/jedisct1/libsodium.js)
  * Last audit by Private Internet Access in 2017.
  * Compiled to WebAssembly
  * 188 KB
  * Portable, cross-compilable, [...] fork of NaCl, with a compatible API
  * License: [ISC License](https://en.wikipedia.org/wiki/ISC_license)
  (FSF approved and GPL compatible)
* Security:
  * Symmetric encryption: XSalsa20-Poly1305 which is AEAD
  * Asymmetric encryption: XSalsa20-Poly1305 which is AEAD
  * Asymmetric signatures: XSalsa20-Poly1305 which is AEAD
  * Hashing: [BLAKE2b](https://www.blake2.net/) (faster than SHA-2, SHA-3,
    but same security) or SipHash-2-4 (only suitable as MAC)
* Drawbacks:
  * you can call `crypto_secretbox` and allow your cryptography to be
    "upgraded" in the future if a newer version emerges that modifies default
    behavior.
* Availability: as a client-side dependency

### SubtleCrypto

* Part of [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
* Provides primitives:
  * Symmetric encryption: AES-CBC, AES-GCM
  * Asymmetric encryption: AES-OAEP
  * Hash: SHA-384, ECHD
* AES-CBC has no authentication, but could be used in combination with signatures.
* AES-GCM has authentication
* Availability: Natively supported by all [current versions of popular browsers](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#browser_compatibility)

### Performance Comparison

<!-- XXX maybe find a better image ? -->
<!-- <media-tag src="https://files.cryptpad.fr/blob/0b/0bbc8f4328d02dec7dcde1301d758752a4e92a6f64cc18bb" data-crypto-key="cryptpad:jGZ4/aYTf32uLNfby/AniubyV44LQD4V131hEnJerFs="></media-tag> -->
<img src="/_assets/review/libraries/performance/performance.png" alt="Comparison Graph" width=100% />

<!-- XXX add a link to github repo for the generation of the benchmarks -->
The figure above shows the performance of the different Cryptographic Libraries
mentioned above (SC stands for SubtleCrypto) on
Firefox, Chromium, and Webkit.
The measurements where done using playwright on a Lenovo ThinkPad X1 Carbon 5th Generation (Intel® Core™ i5-7200U CPU @ 2.50GHz × 4), the actual results might be different.

Nevertheless, the figure gives a raw indication to compare the performance.

* Almost all functions seem to run slower on Firefox.
* Symmetric encryption:
  * NaCl and Sodium are the slowest libraries with a runtime of up to 60 ms.
  * SubtleCrypto functions perform much better and nearly independent of the
    input size. AES-GCM is up to 19 times faster than NaCl (decryption of 1 MB
    on webkit).
* Asymmetric signatures:
  * NaCl performs worst.
  * Sodium and SubtleCrypto's function perform similar
  * Webkit does seem to have a bad support for RSA-SSA and RSA-PSS verification.
* Hashing:
  * Similar to the symmetric encryption, the SubtleCrypto function performs much
    better
  * The time of SubtleCrypto's `SHA-512` is (especially compared to the one of
    NaCl) nearly independent of the input size.
