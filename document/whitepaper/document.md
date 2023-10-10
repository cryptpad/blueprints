---
title: Document
---

In this page, we present *documents* as one of the core concepts of CryptPad.
Historically implemented as encrypted collaboratively editable text documents,
the concept of documents has expanded. Nowadays, other types of data such as
folders, polls and calendars are internally represented as documents on
CryptPad.

We first show the basic idea of how we use encryption to control access rights.
Next, we present the consensus algorithm that ensures that changes to a document
are propagated to the users in nearly real-time.
In the Encryption section, we then explain the key derivation in multiple
different scenarios that enables end-to-end encryption, prevents user abuse
attacks, and is easy to use.
We further explain CryptPad’s ownership model in the ownership section.
Finally, we discuss in “Self-Destructing Documents” how we build
self-destructing documents depending on either the time or upon the opening of
the sharing link.

## Consensus Protocol

The main difficulty for near real-time collaboration is in reconciling the fact
that it is impossible for two events separated by some distance to interact
instantaneously. We therefore introduce in this section a protocol that can
handle simultaneous edits of documents.

CryptPad uses its own protocol based on <abbr title="Operational
Transformation">OT</abbr> and directed acyclic graphs. The basic idea is to
generate *patches* from one state to the next and to collectively decide the
order in which the patches need to be applied.

The user stores a local copy known as the *authoritative document* which is the
last known state of the document that is agreed upon by all the users. The
authoritative document can only be changed as a result of an incoming patch from
the server.

The difference between modified document and the authoritative document is
represented by a *patch* known as the *uncommitted work*. A patch further
references the hash of the authoritative document. The patches therefore build a
directed acyclic graph where we call the longest path to be the *chain*.

As the user adds and removes data, this uncommitted work grows. Periodically the
user transmits the uncommitted work in the form of patches to the server. The
server will then broadcast these patches to all users listening to the
corresponding NetFlux channel. The user can afterwards update the authoritative
document and reset the uncommitted work.

When receiving a patch from the server, the user first examines the validity and
discards the patch if the cryptographic integrity and authenticity checks do not
pass. If the patch references the current authoritative document, the user
applies the patch to the authoritative document and transforms the uncommitted
work by that patch.

Otherwise, the user stores it in case that other intermediate patches have not
yet been received. It could be that a patch references a previous state of the
document which is not the authoritative document. The user stores the patch in
this case as it might be part of a fork of the chain which proves longer than
the chain which the engine currently is aware of.

In the event that a fork of the chain becomes longer than the currently accepted
chain, a “reorganization” will occur which will cause the authoritative document
to be rolled back to a previous state and then rolled forward along the newly
accepted chain. During reorganization, users will also revert their own
committed work and re-add it to their uncommitted work. Conflicts are resolved
with a dedicated scheme that depends on the type of changes, e.g., deletions
have precedence over replacements. It might therefore be the case that some
changes are lost during conflict resolution. However, due to the short period
between two consecutive patches and the fast conversion of chains, this is not a
problem in practice.

A special type of patch, known as a *checkpoint*, always removes and re-adds all
content to the document. The server can detect checkpoint patches because they
are specifically marked on the wire. In order to improve performance of new
users joining the document and “syncing” the chain, the server sends only the
second most recent checkpoint and all patches newer than that.

## Encryption

In this section, we present the encryption scheme for documents. We first show
how we use symmetric encryption of messages and then how we derive the keys for
different types of documents: encrypted blobs, editable
documents, and forms.

For every document, we want to distinguish between at least two access rights:
reading and writing.
To cryptographically enforce these access policies, we use symmetric encryption
to restrict read access and public-key signatures to restrict write access.

More specifically: in order to write data *m* onto a document, a user must
possess a symmetric encryption key K and a signing key SK that is part of an
asymmetric key pair (PK, SK).
The user first symmetrically encrypts *m* to a ciphertext *c* using K.
This ciphertext effectively hides its underlying content from anyone not having
access to K (including the server).
Then, to prove the write access right, *c* is further asymmetrically signed
using SK resulting in a signature *sig*.
Finally, the signed ciphertext (*c*,*sig*) is sent over a NetFlux channel to the
server which checks the signature.
If this check succeeds, then the server stores the message and forwards it to
all users listening to the same channel.
Otherwise, the message is neither stored nor forwarded.
When users receive a ciphertext, they can decrypt it using K.
<!-- I think it's K here and not SK as in the whitepaper document -->
A user who does not have SK, but only K and PK may read new incoming
encrypted blocks, but cannot draft new ones.
The separation of encrypting and signing further allows outsourcing
the validation of (*c*, *sig*) to the server as it can know PK, but not K.

To collaboratively work on a document, users must share the aforementioned keys
with their collaborators.
Our key derivation scheme is specifically designed to make the sharing of these
keys easy.
We therefore first outline how keys can be shared and then show how we actually
derive the keys to enable this simple sharing mechanism for different use cases,
i.e., for encrypted blobs, editable documents, and forms.

There are two ways to share a document and its keys: via CryptPad’s
internal communication mechanisms (cf. [Messaging](./messaging/)) or by sharing
a URL.
For the latter, we use the fact that the URL part after `#` is never
sent to the server.[^BFM2005]
Users can therefore safely put the information required to derive keys in a URL
after the `#` symbol.[^1]

Since users may opt for an additional password required to have access to the
document, we do not directly put the keys into the URL, but derive them from a
seed concatenated to a (possibly empty) password pwd.
This feature is especially useful in the case that there is no confidential
channel to securely share the link: if there are two distinct unconfidential
channels (e.g., email and SMS), the users can share the URL over one channel and
the password over the other one.
While not resulting in a truly secure sharing, the probability for an adversary
to intercept both components is lowered.

### Encrypted Blobs

<figure id="fig:filecryptor2">
TODO
<figcaption>Figure 1: Key derivation for encrypted blobs</figcaption>
</figure>

Encrypted blobs such as uploaded PDFs, images or videos are encrypted once and
stored on the server.
There is no need for more fine-grained access control as editing the static
document is by definition not possible.
It is therefore enough to only derive a symmetric key
K, but not a signing key pair.
The key derivation is depicted in [Figure 1](#fig:filecryptor2).

We first concatenate the (possibly empty) password pwd with the seed fileKeyStr
and hash the resulting string.
We then split the hash digest into 24 bytes for channel unique identifier
`chanID` the and 32 bytes for the symmetric key K.

In case that fileKeyStr is empty, it is initialized to 18 random bytes and
returned as an additional output.
This will allow anyone in its possession and knowing pwd (if it exists) to derive
the same `chanID` and K. Thus, they can download and decrypt the file.

### Editable Documents

Most of the editable documents are only modifiable by selected users.
These users are not only able to decrypt the document, but also to sign patches
and send them to the server.
We therefore need to derive both a symmetric encryption key K and a signing key
pair (PK, SK).

<figure id="fig:encryptor2">
TODO
<figcaption>Figure 2: Key derivation for editable documents</figcaption>
</figure>

To create a new document with all the above capabilities, we derive the keys as
depicted in [Figure 2](#fig:encryptor2).
The inputs are again a (possibly empty) password `pwd` and a seed `editKeyStr`.
In case that the latter is empty, we initialize it with 18 random bytes and
return it as an additional output. We then hash the concatenated `pwd` and
`editKeyStr` and split the resulting hash into two parts.
From the first part we generate the signing key pair (PK, SK).
The second part of the hash forms the `viewKeyStr` and is fed together with
`pwd` into another hash from which we derive the `chanID` and the symmetric key `K`.

Users may want to publish a document (for instance, a blog post) so that others
can only read them, but not change them.
To achieve this, users can publish the `viewKeyStr` since it allows – together
with the knowledge of a potential `pwd` – to derive the symmetric key `K` as
well as the `chanID`.
Moreover, `viewKeyStr` is independent of the input bits to KGen(·) that
produced the signing key pair (PK, SK).
It is therefore not possible to deduce the signing key SK required to edit the
document from the knowledge of `viewKeyStr`.

### Forms

<figure id="fig:form">
TODO
<figcaption>Figure 3: Key derivation for a form</figcaption>
</figure>

There are more complex use cases which require even more fine-grained
access control and therefore also more encryption and signing keys to
differentiate the access rights. One such example is a form having
multiple roles: the *authors* should be able to write, view and answer
the questions, as well as to view all responses to the form. The
*participants* should be able to view the questions and to answer them.
However, participants should not be able to read the responses.
Furthermore, there are *auditors* with the capability to view all
responses, but without the capability to answer the form themselves. The
auditor role can be used to incorporate answers from a privileged set of
form respondents in real time.[^2]

This illustrates the need for two different sets of keys. First, we need a
symmetric key K<sub>1</sub> that allows to encrypt/decrypt the questions, as
well as a key pair (PK<sub>1</sub>, SK<sub>1</sub>) to change the questions.
Second, we need an asymmetric key pair (PK<sub>E</sub>, SK<sub>E</sub>) to
encrypt/decrypt the answers and a signing key pair (PK<sub>2</sub>,
SK<sub>2</sub>) to prove the answer capability. We distribute the keys as
follows:

- We derive all keys from a seed and give this seed to the authors so that they
  can perform any action they want.
  They will encrypt the questions with K<sub>1</sub> and sign them with
  (PK<sub>1</sub>, SK<sub>1</sub>) to prove write access.
  Furthermore, they derive a public encryption key pair (PK<sub>E</sub>,
  SK<sub>E</sub>) used to encrypt/decrypt form replies.
  Finally, they use the signing key pair (PK<sub>2</sub>, SK<sub>2</sub>) to
  prove/verify the ability to reply.

- The participants get a seed that allows them to derive K<sub>1</sub> and
  thus to read the questions.
  They further get (PK<sub>1</sub>, SK<sub>1</sub>) to sign their answers and
  PK<sub>E</sub> to encrypt their answers.
  However, they cannot decrypt the answers of others.

- Finally, the auditors get to derive K<sub>1</sub> and thus to read
  the questions; (PK<sub>E</sub>, SK<sub>E</sub>) to decrypt the replies; and
  PK<sub>1</sub> to verify their signature.

The key derivation is depicted in [Figure 3](#fig:form)
 and extends the derivation of
editable documents. The asymmetric signing key pair (PK<sub>1</sub>, SK<sub>1</sub>),
respectively K, is derived in the same way as (PK, SK),
respectively K, in editable documents; and and are also
identical to their counterparts in editable documents.

However, we derive some more keys: We hash SK<sub>1</sub> to generate (PK,
SK){<sub>E</sub>} used for asymmetric encryption of replies.
We further use the bytes 32 to 63 of the hash of to derive signing key pair (PK,
SK){<sub>2</sub>}.[^3] This key derivation scheme ensures that the possession of
does not allow deducing SK<sub>1</sub> or SK<sub>E</sub>.
Also, it is not possible to deduce SK<sub>1</sub> from SK<sub>E</sub>.

## Ownership

CryptPad has a concept of document ownership to restrict some actions such as
document deletion and password enabling to *owners*.
Ownership is not limited to single persons, but can be held by a team, or it can
be shared, i.e., an existing owner can add another.
We implement ownership by relying on public keys, the server can therefore not
associate usernames to documents.

When creating a document (or uploading an encrypted blob), users also submit
their long term public signing key to mark themselves as owners.
The server then associates the public key to the document.
To perform an ownership-restricted action to a document, the owners send a
request signed with their public key to the server.
If the signature is correct and the public key is associated with the document
match, the server performs the requested action to the document.

## Self-destructing Documents

CryptPad includes a feature to create self-destructing documents that will
automatically be deleted.
This feature therefore helps to ensure that confidential data will not be leaked
and that sensitive data is not accessible forever.

An exemplary use case is password sharing where the password owner shares it via
a URL sent to a peer.
Fearing that the peer’s laptop might be accessed by unauthorized third-parties
at a later point in time, the password owner wants to ensure that the document
can only be opened once and will be destroyed automatically afterwards.

The self-destruction can be based on two mechanisms: either on an expiration
time or on the event of opening a shared link.
For the first mechanism, the expiration date has to be set during the document
creation and cannot be changed afterwards.
The expiration date is written to the document’s metadata which can be read by
the server.
When fetching the document, the server first checks whether the expiration time
has elapsed.
If this is the case, the server deletes the document beforehand to prevent the
users from fetching it.
In the case where the expiration time elapsed while the document is opened by a
user, it will be nevertheless deleted and the user will be disconnected.
However, the user is still able to read the document until closing the
corresponding browser tab.

The second mechanism, which we call “view-once-and-self-destruct”, changes the
way a shared link is created and opened.
To create a view-once-and-self-destruct link, the document owner creates an
ephemeral signing key pair and adds the private signing key to the list of
owners of the document.
This signing key is then together with a label “view-once” appended to the
view-only link and sent to the receiver.

When the receiver opens the link, the receiver first fetches the content of the
document.
Then, immediately afterwards, the receiver sends the deletion command to the
server.
To prove the deletion capability, the receiver signs the command with the
attached ephemeral signing key.[^4]

[^1]: An example of such a URL looks as follows:
<https://cryptpad.fr/pad/#/2/pad/view/GcNjAWmK6YDB3EO2IipRZ0fUe89j43Ryqeb4fjkjehE/>

[^2]: You can, e.g., publish results of an ongoing vote in real time.

[^3]: There is a bit overlap between `K` and the input to
`KGen\[<sub>S</sub>\]{\cdot}`. This overlapping poses no effective threat as
there are still 16 independent bytes. However, we will fix this in a
future version.

[^4]: We assume the receiver to be honest and to correctly issue the
deletion command. This assumption is implicit in any such scheme, as a
malicious user could always take screenshots and thus circumvent
deletion.

[^BFM2005]: T. Berners-Lee, R. Fielding, L. Masinter: "Uniform Resource Identifier (URI): Generic Syntax". Jan. 2005. URL: [http://www.rfc-editor.org/rfc/rfc3986.txt](http://www.rfc-editor.org/rfc/rfc3986.txt).
