---
title: CryptDrive
---

Here, we introduce *CryptDrive* which provides users an interface to store and
manage all their documents. We further allow the users to store their
long term keys used to, e.g., encrypt messages or to prove ownership of a
document.
However, all this information is encrypted and thus unreadable for the server.
We first show the registration and login mechanism during which the server sees
neither the username nor the password.
Second, we show that the server is nevertheless able to do storage management
and, e.g., impose storage limits.

## Registration and Login

On a high level, we use the username and the password to generate login
keys with which we access an encrypted file containing the user’s long
term keys as well as pointers to the user’s documents and folders. The
mechanism is depicted in
<a href="#fig:login_mechanism" data-reference-type="ref"
data-reference="fig:login_mechanism">1</a> and is explained below.

<figure id="fig:login_mechanism">
TODO

<figcaption>Figure 1: Derivation and storage of the login and long term
keys.</figcaption>
</figure>

During registration and login, we locally derive login keys using the <abbr
title="Key Derivation Function">KDF</abbr> `scrypt`[^Percival09] which is
designed to be memory expensive and therefore renders brute force attacks
impractical as they are not feasible in a reasonable amount of time.
More specifically, we derive from the password a symmetric encryption key
K<sub>L</sub> and an asymmetric signing key pair (PK<sub>L</sub>,
SK<sub>L</sub>). We let the salt for this key derivation be the concatenation of
the username and the per-instance string salt<sub>I</sub>.
The usage of a per-instance salt prevents the attacker from pre-computing
rainbow tables for all instances and cracking passwords easily after a potential
database compromise.
Note that the selection of the used bytes (see <a href="#fig:login_mechanism"
data-reference-type="ref" data-reference="fig:login_mechanism">Figure 1</a>) is
not continuous due to legacy reasons.


A password change will result in a change of the login keys.
Since we want some keys, such as the user’s long term signing keys, to be
invariant, we cannot rely on the login key to derive all further keys.
Instead, we randomly generate long term encryption and signing keys
(PK<sub>E</sub>, SK<sub>E</sub>) and (PK<sub>S</sub>, SK<sub>S</sub>) during
registration to store them in an encrypted data structure. This data structure
is the same
that we use for encrypting documents (cf.
[pad encryption](../document/)), hence we
refer to it as an encrypted “document”. We then read/write URL providing
access to this document using the login key K<sub>L</sub> and store
them in a symmetrically encrypted blob on the server. We further add the
verification key PK<sub>L</sub> to the metadata of this blob to mark the
ownership to the server.

To log in, the user derives the exact same keys (PK<sub>L</sub>, SK<sub>L</sub>)
and submits then the public key to the server.
Since the user has derived the symmetric encryption key K<sub>L</sub>, the user
can decrypt the blob and obtain the read-write URL of the encrypted document
containing the long term keys.

This layer of indirection allows changing the password since we only need to
re-encrypt the access to the encrypted document under new login keys
K<sub>L'</sub> and (PK<sub>L'</sub>, SK<sub>L'</sub>).
To change the password, the user first signs the public key PK<sub>L</sub> with
SK<sub>L</sub> to prove the ownership.
The user then sends this signature together with the re-encrypted blob under
K<sub>L</sub> and the attached PK<sub>L'</sub> to the server.
Next, the server uses PK<sub>L</sub> stored in the metadata to verify the
correctness of the signature. If the verification succeeds,
the server can safely replace the encrypted blob and store PK<sub>L'</sub> as
the new verification key.

To let the user access all their folders and documents, we store
pointers to these in the same encrypted document that contains the long
term keys. The access to the user’s folders and documents will therefore
also be safely migrated during a password change.

Note that this login mechanism does not require the server to store the
username, neither in plaintext nor in any hashed form. The server can
therefore not check whether a given username has an account or not.
Another consequence is that multiple users may register with the same
username – as long as their passwords are different.

## Storage Management

So far, we have shown how the data owned by or related to a user is
encrypted. Nevertheless, we want the server to be able to manage the
data storage.

First, the server should be able to impose storage limits so that users
cannot allocate more storage than they are supposed to do. We therefore
create a list of *pins* for each registered user where each list is
identified by the user’s long term public signing key. Every pin
contains a document/blob identifier, a list of owners (represented with
their public keys), and a creation date. The list of pins of a specific
user therefore contains all the documents (co-)owned by this user. To
compute the disk usage of a specific user, the server simply sums up the
size of all documents and blobs contained in the pins. If the maximal
storage quota for a user is reached, then the server hinders the user
from pinning newly created documents and blobs.

Second, we also want the server to be able to identify unused documents
created by guests. This allows the server to delete documents which have
not been opened during certain time period and to thus free disk space.
We therefore add to each (encrypted) file a metadata file not only an
owner list (cf. [ownership](../document/)) but also the
creation time. When the server periodically iterates over all documents,
it can first check whether the document is owned by a CryptDrive user.
If this is not the case, then the server can delete documents that have
not been accessed during, e.g., the last 3 months.

[^Percival09]: Percival, Colin. 2009. “Stronger Key Derivation via Sequential
Memory-Hard Functions.” BSDCan.

