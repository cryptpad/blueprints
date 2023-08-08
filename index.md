---
layout: layouts/base
title: CryptPad Blueprints
---

# CryptPad Blueprints

CryptPad is an end-to-end encrypted collaboration suite that has been under
active development since 2015, and is used by hundreds of thousands of people.
Its feature set has grown from a simple editor to a full-blown set of multiple
applications, drive, teams, etc.

We plan to make the next generation of CryptPad even better with stronger
security guarantees, offline-first collaborative editing, and user-driven
workflows like password reset. This project is the first step in this direction.

These future developments will involve significant work to implement. They also
have to be considered in relation to the existing architecture, guarantee access
to all existing data, and preserve a coherent experience for users. Therefore a
migration path has to be carefully outlined to go from the current state of the
product to a proposed "next generation".

With CryptPad Blueprints we propose to thoroughly review the current state of
CryptPad, and to plot the trajectory towards its next generation. This is
done through a series of deliverables outlined below, ranging from a white paper
to technical prototypes.

---

This project is funded through the [NGI0 Entrust](https://nlnet.nl/entrust) Fund, a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement N<sup>o</sup> 101069594.

<p float="left">
  <img alt="NGI0 Entrust" src="https://nlnet.nl/image/logos/NGI0Entrust_tag.svg" width="100" />
  <img alt="NLNet Foundation" src= "https://nlnet.nl/image/logo_nlnet.svg" width="100" />
</p>

## [Document and Explain CryptPad's Security](./security/)

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

## Review of the State of the Art in Applied Cryptography

We review the cryptography used in CryptPad and compare it against the state of
the art in applied cryptography. For this, we evaluate the security of
third-party libraries, and [benchmark](./libraries/performance) their
performance. We summarize our findings in a detailed
[comparison of cryptography libraries](./libraries/main.pdf)

We further re-think CryptPad's architecture to change from static, hard-coded
algorithms towards more [cryptographic agility](./agility/main.pdf). This allows
us to update vulnerable algorithms and to adjust parameters more easily in the
future. Importantly, we can start to prepare the security of CryptPad in a
post-quantum world. We setup criteria for when and how to change towards
post-quantum ciphers.

## Roadmap to the next-generation CryptPad

We explore and outline desired features for the next-generation CryptPad:

* [Revocation](./revocation) for a more fine-grained degree of access control
  e.g. to the document history.
* [Account-recovery](./secretsharing/) mechanism making use of social secret
  sharing.
* [Offline-first editing](./yjs/README.md) by the use of Conflict-free
  Replicated Data Types (CRDTs).

An integral part is to plan how these features can be integrated with CryptPad
in terms of security, usability and performance; and how the current platform
can be migrated to use them. We prototype the above functionalities
to anticipate potential hurdles and estimate the needed implementation effort.
We anticipate that some features such as perfect forward secrecy and CRDTs may
be accessible for users as a demo. For other features like social secret
sharing, which are probably new to most of our users, we will create mock-ups to
surface issues and questions in user experience.
