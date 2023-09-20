---
title: Encourage non-default instance salt
term: short
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

Instance administrators need to set a custom `loginSalt` before running
CryptPad in a production environment. This value is supposedly only
rarely changed from the default.

### Consequences:

The `loginSalt` makes it such attackers who want to brute-force common
credentials must do so again on each CryptPad instance that they wish to
attack. If `loginSalt` is the default one, then there is no protection
against this.

### Suggestions:

1.  Mention the `loginSalt` more prominently in the documentation.

2.  Write an installation script that initializes this salt to a random
    value.

### Drawbacks:
