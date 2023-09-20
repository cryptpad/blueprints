---
title: Limit Login Block Size
term: short
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

There is no maximum login block size enforced by the server.

### Consequences:

Attackers can run a Denial of Service attack on the server's memory by
uploading large data as login blocks. The initial login block has to be
signed which may impose too much computational work for the attack to be
successful. However, the initial login block can be replaced in which
case only the corresponding public key has to be signed.

### Suggestions:

Impose a limit on the login block size.

### Drawbacks:

The username is part of the login block. Therefore the size is not bound
theoretically, but only practically (e.g., username not bigger than 100
characters).[^1] Moreover, the login block size might grow in the future
in which case the limit has potentially to be adapted.

[^1]: It is unclear, whether the username is needed to be in the login
    block at all. This has to be further investigated.
