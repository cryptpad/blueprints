#### Explicit membership

> As a **document editor** I want to **know who has access to a document before
> I enter any information** so that I **don't accidentally share sensitive
> information with the wrong audience**.

Background:

* When access lists are enabled, editors only see their contacts' name in the
  access list, other users are labelled with "unknown":

  <media-tag
  src="https://files.cryptpad.fr/blob/8e/8ea0f1a66245774e6ba155fe20e80523627c0a9dfc6e3a38"
  data-crypto-key="cryptpad:Dr7+NiCfbOe30bXD0nEu+7CwjemOYgVnuT2Wo2H82O0="></media-tag>

  This is done to not leak this users names (like `cc`-ing in emails)

Acceptance Criteria:

* [ ] This is an opt-in option to protect the anonymity by default

