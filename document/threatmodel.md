---
title: Threat Model
eleventyNavigation:
  order: 1
---

Adversarial Capabilities
------------------------

CryptPad uses a server not only to store the data, but also to provide the
client application (i.e. the JavaScript code) to the users. The users must
consequently trust the server to provide the correct application since no
security guarantees can be established otherwise. We therefore assume that the
server is "honest-but-curious", i.e., that the server behaves according to the
protocol, but tries to deduce user data. The server will therefore not
maliciously alter, delete or copy data. However, the data sent to the server or
stored in its database may be compromised.

In contrast, we assume that the adversary might have active network
capabilities. This involves capturing, modifying, deleting, and replaying of
transmitted network messages.

The scenario of an honest-but-curious server with additional active network
capabilities is indeed realistic as a third-party CryptPad instance has been
forced to give law enforcement access to the (encrypted) data. This example further
illustrates how users want to protect against an honest-but-curious server even
though they trust it in the first place.

We further assume that users who want to collaborate have an existing
secure channel for the initial secret sharing.

Desired Properties
------------------

Under the above threat model, CryptPad aims to achieve multiple
security properties. The following
list  does not indicate any ranking.

* **End-to-end encryption of all user data.** All personal data leaving the
  client application can only be accessed by authorized users.

* **Plausible deniability for accounts.** The server cannot say whether a given
  username is registered or not.

* **Fine-grained access delegation.** Users have precise control over their
  owned documents. They can selectively delegate specific access rights such as
  view-only or write access.

* **Resistant to MITM attacks.** No entity can secretly relay and alter the
  communication between the server and the user to obtain sensitive data.

* **Resistant to user abuse attacks.** No entity can access any information to
  which they were not granted access.

* **Resistant to impersonation attacks.** It is not possible to impersonate the
  server or a user.

* **Simple to use.** CryptPad is designed to be easy to use. The user interface
  is intuitive and hides the cryptographic details, but nevertheless lets the
  user understand the implications of the chosen options.
