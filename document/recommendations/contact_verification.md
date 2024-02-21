---
title: Contact Verification
term: short
tags: roadmap
id: contact-verification
linkto: [reduce-trust, secret-sharing, revocation]
author: Theo von Arx, Aaron MacSween
date: 2023-03-14
---


### Problem:

There is no easy way to verify whether a CryptPad contact corresponds to
the expected person. Profile pages contain the public key of the users,
but they are not signed and hence spoofable.

### Consequences:

Attackers can impersonate a person and gain access to teams, documents
and folders.

### Suggestions:

Implement a method that allows users to verify their contacts and
whether a conversation is secure. One approach could be to use safety
numbers[^1] to let users verify whether the binding of
the public key to the user is correct. It is important to provide a
clean interface that is easily understandable for users and invites them
to actually perform the contact verification.

### Drawbacks:



[^1]: Marlinspike, Moxie. 2016. “Safety Number Updates.” *Signal Blog*, November. https://signal.org/blog/safety-number-updates/.