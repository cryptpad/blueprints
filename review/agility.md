---
title: Towards More Cryptographic Agility
author: Theo von Arx
date: 2023-10-12
tags: roadmap
id: agility
pdf: /_assets/review/agility/main.pdf
pdfpath: ../_assets/review/agility/main.pdf
linkto: [revocation, bit-overlap, transition-new-encryption]
showtoc: true
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

## Introduction

The current architecture of CryptPad uses hard-coded cryptographic
primitives such as X25519-XSalsa20-Poly1305 or SHA-512 implemented in
the Tweet-NaCl library for JavaScript.[^Bernstein2015]<sup>,</sup>[^Chestnykhm2016]
While all the used primitives are still considered to be secure and
there are no known vulnerabilities, this might change in the future.

This "fear" has become more accentuated with the increasing efforts on quantum
computing over the last decades.
Quantum computers will be able to solve problems that are hard for today's
computers.
These problems include the integer factorization problem, the discrete logarithm
problem, and the elliptic-curve discrete logarithm.
As a consequence, the currently used primitives for asymmetric encryption and
signatures would be broken and would not provide much security anymore.
This danger will not only arise with the arrival of large-scale quantum
computers, but already well before: companies and governments could already
collect encrypted data now and decrypt it later.

Since 2016, the American <abbr title="National Institute of Standards and
Technology">NIST</abbr> is working on standardizing Post-Quantum Cryptography.
Draft standards are currently expected to be available by 2024.
NIST recommends organization and companies not to wait for the standard to be
done, but rather already start preparing the transition of the used primitives.

Consequently, CryptPad should already start today towards more cryptographic
agility.
We want to be flexible in the choice of algorithms, key sizes and other
parameters.
Having the possibility to more easily change the cryptographic primitives will
make the transition smooth, and ensures the security of CryptPad in the long
term.

## Inventory of cryptographic primitives

[Table 1](#overview-algorithms) gives an overview over the used primitives.
It further indicates whether the algorithms are secure against quantum
computers.
This is not the case for both, the asymmetric encryption and signatures
algorithms in use.
The reason is that the security of these is based on the elliptic discrete
logarithm problem.

<table id="overview-algorithms">

| Primitive               | Algorithm                | Usage                                                                          | Quantum Resilient[^Carames2020] |
|:------------------------|:-------------------------|:-------------------------------------------------------------------------------|:--------------------------------------------------------|
| Symmetric encryption    | XSalsa20-Poly1305        | Login Block, Documents                                                         | Yes                                                     |
| Asymmetric encryption   | X25519-XSalsa20-Poly1305 | Messaging, symmetric key distribution                                          | No                                                      |
| Asymmetric signatures   | Ed25519                  | Proving write rights to documents and mailboxes, answering polls, access lists | No                                                      |
| Hashing                 | SHA-512                  | Key derivations                                                                | Yes                                                     |
| Key-derivation function | Scrypt                   | Derive login keys                                                              | Yes                                                     |

  <caption>Table 1: Overview over the used primitives in CryptPad.</caption>
</table>

The most sensitive data in CryptPad is in the symmetrically encrypted
login block as it contains all the keys for the user's drive, i.e.,
document keys, private signing and encryption keys, as well as team
keys. The next-most sensitive data is then encrypted in the documents.
While these are also symmetrically encrypted and thus secured in the
long-term view, the problem is the key transport distribution using
asymmetric encryption. A quantum attacker intercepting (or having
recorded) and breaking asymmetrically encrypted messages can therefore
also get access to documents.

Vulnerable signatures on the other hand are less severe as a quantum
attacker breaking them long after it has actively modified poses only a
small threat (namely to blame the author(s) on having written harmful
content). However, once there exist real-world quantum computers, the
signature algorithm needs to be exchanged against one that is quantum
secure.

## Criteria for updating cryptography primitives

We propose to replace the currently used cryptography primitives (i.e.,
XSalsa20-Poly1305, Ed25519 provided by Tweet-NaCl) when one or several
of the following criteria are met:

1.  There is a severe security vulnerability that cannot be fixed.

2.  The <span acronym-label="NIST"
    acronym-form="singular+short">NIST</span> standardizes a
    post-quantum cryptography schemes, *and* this scheme has a stable
    and audited JavaScript implementation (or binding).

3.  Cryptography operations are a restricting bottleneck for
    performance, *and* there are other, significantly faster libraries
    that provide at least the same security level.


## Strategies

### Login Block

While protecting the most sensitive data, the encryption mechanism of
the login block is also comparably easier changeable than others. The
only requirement for cryptographic agility in the login block is that
the username and password are enough to decrypt the login block.

There are two algorithms involved in the login procedure: a
KDF and
symmetrical encryption. We therefore propose how to achieve more
cryptographic agility for both of them.

Since there is no central entity knowing all the usernames and
passwords, the KDF cannot be replaced from one day
to another. Depending on the awareness of the users transition for all
accounts will take months up to years. In case of a detected
vulnerability, it is therefore key to efficiently reach all users via
the internal platform, but also over email (e.g., for the emails
associated to premium accounts), social media, and the blog. If a
discovered vulnerability is so severe that passwords could be cracked,
then users should be forced to set a new password upon login.

### Change of the KDF

Since the server does not have any information about the user, there is no easy
way to know in advance which KDF should be used. Hence, the best way is to
proceed by trial and error: check if the usage of KDF *A* leads to a decryptable
login block. If not, proceed with KDF *B*, then KDF *C*, etc.

Unfortunately, since KDFs are required to be slow, this will take quite some
time. After a successful login, the login block has to be automatically
re-encrypted using the latest KDF.

### Change of the symmetric encryption algorithm

By putting the used algorithm into the plaintext metadata associated to a login
block, we know which algorithm to use. Similar to the above, a legacy algorithm
should be updated to the latest one after a successful login.

## Documents

### Re-encrypt under same seed

One difficulty of changing the algorithms involved in documents is that
we want the URL still to be valid so that users do not have to
redistribute the access link. The strategy is therefore to derive new
keys for a new algorithm from the same seed.

To achieve this, we specify the algorithm along with the parameters and
the public verification key in the (unencrypted) metadata as well as in
every sent patch. Only document owners are allowed to change the
algorithm to avoid malicious user specifying broken algorithms. Also,
there should be consensus on what is the best (latest) algorithm to use
to avoid clients fighting about that. Currently, this can easily been
done since the client code is shipped by the server and can be updated
almost simultaneously.

It is up to debate whether the chanID
should also be changed after algorithm change.

<figure id="fig:key_derivation">

<pre class="mermaid">
%%{ init: { 'flowchart': { 'curve': 'stepAfter' } } }%%
graph TD
	editKeyStr
	pwd
	PK
	SK
	viewKeyStr
	chanID
	K
	H1["H( · )"]
	KGen["KGen( · )"]
	H2["H( · )"]

	editKeyStr --> H1
	pwd --> H1
	pwd --> H2
	H1 -- "0..31" --> KGen
	H1 -- "32..63" --> viewKeyStr
	H1 -- "32..63" --> H2
	H2 -- "0..15" --> chanID
	H2 -- "16..47" --> K
	KGen --> PK
	KGen --> SK

	classDef variable fill:none,stroke-width:0px
	class editKeyStr variable
	class pwd variable
	class PK variable
	class SK variable
	class viewKeyStr variable
	class chanID variable
	class K variable
</pre>

<figcaption>Figure 1: Key derivation for editable documents</figcaption>
</figure>

### Re-encrypt under new seed

There might be the case of a severe vulnerability in SHA-512 that violates the
one-way property. Attackers could consequently deduce the editKeyStr as well as
the password from the viewKeyStr or even from the encrypted block if there is a
second vulnerability in the encryption scheme (cf. <a
href="#fig:key_derivation" data-reference-type="ref"
data-reference="fig:key_derivation">Figure 1</a>). In this case, document owner should
re-encrypt the document under a new algorithm using a new, randomly generated
seed. Since this involves broken links, old links should inform users that the
content was changed and that they need to request the new access link.

### About the seed length

When planning to re-use the seed for different encryption schemes, it
should be long enough to provide good entropy for future usages. While
we currently use 144 Bits (≈ 24 chars), 256 bits are considered to be
safe beyond 2030.[^Giry2020] To keep the URLs short, we can add
additional characters to the alphabet such as emojis (up to 1874
characters).

## Messaging

The problem in messaging differs from the one of documents in that there
is no seed to derive keys from. However, all users can pin algorithms
and public encryption and verification on their profile page. A sender
then automatically looks up these values and encrypts the message with
the user’s preferred parameters.

An unavoidable problem is that user’s that did not log in for a long
time cannot update their keys and algorithms. The only way to counteract
leaking sensitive data over such insecure channels is to completely stop
using these algorithms and thus stop messaging these users.

Another problem that already exists in the current version of CryptPad,
but that is further accentuated: the profile pages are not
cryptographically secured and could be spoofed.[^1] A mechanism such as
Signal’s safety numbers can help to prevent against this.

## Teams

In contrast to documents, teams have a clear set of users that should be
directly informed about changes of cryptographic algorithms. We can take
advantage out of this and let team administrators change the encryption
algorithm and distribute the new keys to all other members according to
their role.

[^Bernstein2015]: Bernstein, Daniel J., Bernard van Gastel, Wesley Janssen, Tanja Lange,
Peter Schwabe, and Sjaak Smetsers. 2014.
“<span class="nocase">TweetNaCl: A Crypto Library in 100 Tweets</span>.”
In *Progress in Cryptology - LATINCRYPT*, edited by Diego F. Aranha and
Alfred Menezes, 64–83. Cham: Springer International Publishing.

[^Chestnykhm2016]: Chestnykhm, Dmitry, Devi Mandiri, and AndSDev. 2016-. “TweetNaCl.js.”
<https://github.com/dchest/tweetnacl-js>.

[^Carames2020]: Fernández-Caramès, Tiago M., and Paula Fraga-Lamas. 2020. “Towards
Post-Quantum Blockchain: A Review on Blockchain Cryptography Resistant
to Quantum Computing Attacks.” *IEEE Access* 8: 21091–116.
<https://doi.org/10.1109/ACCESS.2020.2968985>.

[^Giry2020]: Giry, Damien. 2020. “Cryptographic Key Length Recommendation.”
<https://www.keylength.com/en/compare/>.

[^1]: Note that this requires an active server-side attacker.

## [PDF]({{ pdf | url }})

<script type="module">
  import mermaid from '/node_modules/mermaid/dist/mermaid.esm.mjs';
  mermaid.initialize({
    startOnLoad: true,
  });
</script>
