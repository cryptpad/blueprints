---
title: Transition to New Encryption Schemes
term: medium
tags:
  - recommendations
  - roadmap
author: Theo von Arx, Aaron MacSween
date: 2023-03-14
id: transition-new-encryption
linkto: [reduce-trust]
---

### Problem:

When a new CryptPad versions introduces new encryption scheme, old
documents are not updated to this.

### Consequences:

If a vulnerability in the encryption scheme is discovered, old documents
can not be protected other than being destroyed. To keep the content,
users would need to manually export and import it.

### Suggestions:

Implement an upgrade mechanism to the latest encryption scheme that can
be activated by users. Ideally, the old links are still valid. To
achieve this, the new keys can be generated from the same seed as the
old ones and the old URL can redirect to the new one.

### Drawbacks:

Users might get confused, and old links may be broken after the upgrade.
