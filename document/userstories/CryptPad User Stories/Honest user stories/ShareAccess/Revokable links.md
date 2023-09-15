#### Revokable links

> As a **document owner** I want to **revoke all links I have shared until now**
> so that I can **be reassured that no unintended people will have access**.

Background:

* We currently directly share the (static) document keys, hence we only have one
  link per document
* This requires a new level of indirection, or on access control
* Issue [Revoke Access once link has been shared?
  #397](https://github.com/xwiki-labs/cryptpad/issues/397)

Acceptance Criteria:

* [ ] Selective revocation on a per-link basis
* [ ] The document owner should be able to annotate some pseudonyms to links, so
  that they know whose access should be revoked
* [ ] Only a small set of trusted users are able to revoke the access link

