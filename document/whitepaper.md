---
title: Whitepaper
author: Theo von Arx
date: 2023-03-16
version: 1.1.0
pdf: /_assets/document/whitepaper/main.pdf
git: https://github.com/cryptpad/blueprints/tree/main/document/whitepaper
eleventyNavigation:
  order: 2
---

## Abstract

Collaborative document editing has grown popularity over the last decades. This
has been driven by the ease of use of online platforms compared to workflows
requiring participants to mail versions back and forth and reconcile changes.
However, common tools such as Google Docs or Microsoft's Office 365 come with an
impact to their users privacy. The server hosting these services can access all
stored documents and actively modify or passively read their content.

In this paper, we present the cryptographic design of CryptPad, a web-based,
end-to-end encrypted, collaborative real-time editor for a variety of document
types. We show how we use cryptography to protect against attacks in an
honest-but-curious threat model. We present multiple dedicated schemes that use
a mix of asymmetric and symmetric encryption, as well as signing, to allow
fine-graded access control, private messaging, and team collaboration. Despite
the common perception that cryptography is too complicated for the average user,
CryptPad remains simple to use and has a large and growing user base.