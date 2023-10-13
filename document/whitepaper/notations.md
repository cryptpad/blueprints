---
title: Notations
eleventyNavigation:
  order: 3
---

In this section we introduce the libraries used in CryptPad and the notation we
further use in the whitepaper.

For the <abbr title="Key Derivation Function">KDF</abbr>, we use `scrypt`.
We define `KDF(pwd, salt)` to be a call to `scrypt` using the password `pwd` as
an input.

All other cryptographic operations are done using the `TweetNaCl.js`
[library](/review/libraries/).
We also use `TweetNaCl.js` to sample random bytes.
However, `TweetNaCl.js` itself relies on the browsers' sources of secure
randomness.

Symmetric encryption is authenticated and uses the `XSalsa20-Poly1305` algorithm.
Let us define `SymEnc(K, m)`$ be the resulting symmetric encryption of the
message `m` under the secret key `K`.

Public-key encryption is authenticated and uses
the `x25519-XSalsa20-Poly1305` algorithm.
We let KGen<sub>E</sub>(`seed`) be the derivation of an asymmetric key pair
`(PK, SK)` from the random seed “`seed`”.
Here, `PK` and `SK` denotes respectively the public and the secret key of the
public key encryption scheme.
We use Nacl.box(m, N, PK<sub>B</sub>, SK<sub>B</sub>) to explicitly refer to
the asymmetric encryption of a message `m` under a nonce `N`, Bob's
public key PK<sub>B</sub>, and Alice's private key SK<sub>A</sub>.

Likewise, we use EdDSA algorithm over the Ed25519 curve for signatures and let
KGen<sub>S</sub>(seed) denote the derivation of an asymmetric signing key pair
(PK, SK) from the seed “`seed`”.
The signing of a message `m` under a private key `PK` is written as `Sign(m,
PK)`.

Finally, we use `SHA-512` as a secure cryptographic hash function and denote the
digest of a string `x` as `H(x)`.
To mark a splitting of a string `x` in diagrams, we annotate the arrows with
`i..j` to denote all *bytes* from the `i`-th to
the `j`-th (both included).
We further let `x || y` denote the concatenation of the two strings `x` and `y`.
In diagrams, multiple arrows pointing to the same box (e.g., a hash) may
implicitly denote string concatenation.
