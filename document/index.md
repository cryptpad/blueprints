---
layout: layouts/base
title: Document and Explain CryptPad's Security
eleventyNavigation:
  order: 1
---

We first thoroughly document the cryptography used in CryptPad. We define the
assumed [threat model](./threatmodel/README.md), justify it and explain why
CryptPad does not defend beyond this model. We further describe the platform’s
cryptographic primitives and explain how they are used to build various key
derivation, encryption and decryption schemes. To allow experts to independently
verify CryptPad's security and thus increase the general trust on our platform,
we summarize the findings in a [white paper](./whitepaper/main.pdf). During the
process, we identified weaknesses and make [developer
recommendations](./recommendations/main.pdf) to avoid these shortcomings in
future versions of CryptPad.

Second, we document CryptPad's threat model and
security for a broader audience as part of our [user
guide](https://docs.cryptpad.org/en/user_guide/security.html). In particular, we
clarify against which types of attacks CryptPad can defend and which entities
the users need to trust. Moreover, we show high-risk users the [most secure way
to use
CryptPad](https://git.xwikisas.com/xwiki-labs/cryptpad-blog/-/merge_requests/3)
in a blog post. <!-- todo: Update blog link ☝ -->

Third, to ensure that security concerns and cryptography are considered in the
context of usability we pool from the extensive feedback gathered by the team
over the last few years (support tickets, case studies, GitHub issues, forum
threads, user reports, etc). We adopt a [user stories
approach](<./userstories/CryptPad User Stories.md>) to link technical
choices/constraints with user experience.
