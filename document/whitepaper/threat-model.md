---
title: Threat Model
eleventyNavigation:
  order: 1
---

Here we recall the threat model considered in the [whitepaper](..).
For a full description of the threat model, please refer to [this
page](../../threatmodel/).

We describe adversarial capabilities and goals in detail in the threat
model published on our website. To summarize, we consider an
honest-but-curious server that has additional active network
capabilities. The server has therefore access to encrypted data, but
cannot actively alter, delete or copy data.

We address most of the resulting threats directly in the platform's
cryptographic design. However, to defend against MITM, and partly
against impersonation attacks (server authentication) we rely on the
security guarantees given by the TLS protocol.
