---
term: long
title: Reduce Trust on Server
tags: roadmap
id: reduce-trust
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

Users have to trust the server to deliver the correct client code.

### Consequences:

The threat model is reduced to a honest-but-curious server. Without the
limitation of trusting correct client code delivery, CryptPad could
defend against an attacker with more active capabilities.

### Suggestions:

There are multiple approaches:

1.  Providing an API so that a client can be distributed over an
    independent channel (App-store, GitHub, Browser extensions, ...).

2.  Trust on First Use (TOFU): users are warned when their client code
    changes and are asked whether they want to accept the update or not.

3.  Sign the client code and allow users to verify the signature.

### Drawbacks:

1.  It gets more complicated to use CryptPad, when users first need to
    download a client. Hence, the webclient should still be accessible.

2.  Currently, all users have the same client version. If this is no
    more the case, there might be incompatible features, or even "client
    fights", i.e., clients are resolving patches differently and thus
    always trying to push their version of the document.

3.  Some measures such as signed code may only be effective if the users
    verify them. As experience in the context of HTTPS verification with
    extended validation have shown, this might not be the
    case.[^1]

4.  The code should not only be verified for the flagship instance, but
    also for custom instances. However, they might want to customize the
    client code.

[^1]: Keizer, Gregg. 2019. “Chrome, Firefox to expunge Extended Validation cert signals.” *Computerworld*, August. https://www.computerworld.com/article/3431667/chrome-firefox-to-expunge-extended-validation-cert-signals.html.
