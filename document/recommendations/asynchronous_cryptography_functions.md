---
title: Asynchronous Cryptography Functions
term: short
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14
---


### Problem:

The current cryptography functions including encryption and key
derivation (such as `ViewCryptor2`) are synchronous and do block all
resources.

### Consequences:

No operations can be done in parallel to cryptography functions.
Moreover, natively supported asynchronous functions (e.g., `SHA-256`)
that would bring a speedup cannot be used.

### Suggestions:

Opt for a more general interface in which cryptography functions are
asynchronous

### Drawbacks:

The additional workload coming from parallel execution may be too
resource-intensive on some devices, such as smartphones. Refactoring
large parts of the code to make it asynchronous is tedious.
