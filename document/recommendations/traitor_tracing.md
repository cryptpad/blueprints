---
title: Traitor Tracing
term: long
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

Everyone having read/write access to a document or folder can forward
the keys without being noticed by anyone else.

### Consequences:

The access to folders and documents can be delegated without being
noticed. As such team members have partial admin rights since they can
share (but not deny) access to documents.

There is currently no way to find who leaked a document.

### Suggestions:

Deploy a scheme inspired by broadcast encryption[^1] which
generates new decryption and signing keys for every person allowed to
access the document. CryptPad's setting is different from a traditional
broadcasting one (i.e., communication over satellites where anybody can
listen). This allows to simplify things, e.g., the server can enforce an
access list. Similarly, there is no central node broadcasting, but
potentially many authors interacting with each other. Among these
authors a central user/group is responsible for managing key
distribution.

Once a document is leaked, this allows to trace the traitor, i.e., find
who leaked the keys, and to block the leaking keys from getting access.
In the same way, per-user signing keys could allow for "traitor-tracing"
and revocation of particular edits in the event of a vandal. The pure
knowledge that this is possible will already discourage leaking keys.

### Drawbacks:

1.  Traitor tracing contradicts plausible deniability.

2.  One has to be carefully, who should be able to do the traitor
    tracing. Possible are: owners, everyone with access to a document,
    or everyone. The last should be avoided in favour of privacy.

3.  Tracing can easily be circumvented by importing/exporting a file or
    taking screenshots. However, this only leaks *read* access.

[^1]: Fiat, Amos, and Moni Naor. 1993. “Broadcast Encryption.” In *CRYPTO ’93*. https://doi.org/10.1007/3-540-48329-2_40.