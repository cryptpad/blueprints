---
title: Messaging
---

In this section we present CryptPad’s own end-to-end encrypted messaging
system that allows users to exchange arbitrary messages and metadata
with other users. The messaging system is further used for, e.g.,
instance support, team messaging (cf. [Teams](../teams)) and forms.
An important property of the used encryption scheme is anonymity: A user
eavesdropping on another user’s mailbox can not infer the sender of the message.

The basic block of the message encryption is to use public-key authenticated
encryption with Nacl.box(·) which internally derives a shared key between the
receiver’s and the sender’s keys.

We build our encryption ASymEnc(·) on this by encrypting a plaintext under the
sender’s public/private keys (PK<sub>A</sub>, SK<sub>A</sub>) and the receiver’s
public key PK<sub>B</sub>
follows:

```
ASymEnc(PK_A, SK_A, PK_B, m):
  N <- Random(0,2^192)
  c <- Nacl.box(m, N, PK_B, SK_A)
  return N || c || PK_A
```

The 24-bytes-sized nonce *N* is sampled uniformly at random and is
prepended to the authenticated ciphertext *c*.
The sender’s public key PK<sub>A</sub> is further appended to indicate the
sender’s identity to the receiver.

The receiver can then split the received message into *N*, *c*, and
PK<sub>A</sub> to decrypt it using
Nacl.box.open(c, N, PK<sub>A</sub>, SK<sub>B</sub>).
In case that the sender wants to decrypt this message, the server must
use (PK<sub>B</sub>, SK<sub>A</sub>) instead of (PK<sub>A</sub>,
SK<sub>B</sub>),
since the sender does generally not have access to SK<sub>B</sub>.

However, we do not directly encrypt messages using ASymEnc(·) as this would leak
the sender of the message.
Instead, we apply a second layer of encryption using *ephemeral* keys which are
freshly generated for each message and thus are not linkable to the sender.
Lastly, we may additionally sign the double encrypted messages using a signing
key to prove write access.

An exemplary use case for this is the signing of a form answer: the
users will receive it from the author to prove that they actually are
allowed to send messages answering the form. For other cases the signing
key may be obtained through the accounts’ profile pages, or as a point
of contact in documents.

<figure id="fig:sealing">
TODO
<figcaption>Figure 1: Sealing of a message <span class="math inline"><em>m</em></span> to
return a ciphertext <span class="math inline"><em>c</em></span>.</figcaption>
</figure>

This sophisticated sealing scheme is depicted in
<a href="#fig:sealing" data-reference-type="ref"
data-reference="fig:sealing">Figure 1</a>. It takes as inputs a message *m*, the
long term encryption key pair (PK<sub>A</sub>, SK<sub>A</sub>), the ephemeral
keys (PK<sub>E</sub>, SK<sub>E</sub>), and – optionally – the signing key
SK<sub>B,S</sub> belonging to the receiver’s signing/verification key pair
(PK<sub>B,S</sub>, SK<sub>B,S</sub>).
We first encrypt using the combination of the sender’s and the receiver’s keys.
We then apply the second layer encryption using ephemeral keys (PK<sub>E</sub>,
SK<sub>E</sub>).
Finally, we check whether a signing key SK<sub>A,S</sub> was passed as input.
In this case, we additionally sign the ciphertext before returning it.
Otherwise, we simply return the ciphertext without signing it.

Every user shares its verification key PK<sub>B,S</sub> with the server such
that the server can check the signatures of incoming messages.
Therefore, the receiver does not have to check it.
The receiver, however, needs to decrypt the outer layer using the private key
SK<sub>B</sub> and the supplied ephemeral key PK<sub>E</sub>.
Then the receiver can extract the sender’s public key PK<sub>A</sub> and use it
together with the private key SK<sub>B</sub> to decrypt the inner layer.
