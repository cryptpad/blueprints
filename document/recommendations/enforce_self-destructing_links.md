---
title: Enforce Self-Destructing Links
term: short
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

The destroying of a document that was shared with a
*view-once-and-destroy* is not enforced by the server.

### Consequences:

A malicious user can open such a link, but decide to not destroy the
document. However, it is hard to come up with a scenario in which a
malicious user could not achieve the same by simply taking a screenshot
of the document.

### Suggestions:

Enforce the destruction on the server side.

### Drawbacks:

Although the server sent the content, there is no guarantee that the
user actually received it (e.g., due to connectivity problems or an
active network attack). Hence a document could get destroyed before
being accessed the first time.[^1]

[^1]: Currently, a destroyed document is only achieved, and could
    therefore be restored by instance admins.
