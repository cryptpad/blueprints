---
category: Admin stories
extra:
- background:
  - (D)DoS attackers can register many users and upload large files
  - As attackers can bypass the (client-side) `scrypt` key derivation, it is
      cheap to register users
  - Captchas could be an option, however, it is questionable how effective they
      are. Furthermore they are bad for UI and accessibility. Captchas are
      [discussed for Mastodon](https://github.com/mastodon/mastodon/issues/877)
  - Another idea is to allow only invited participants to register. See
      [PR \#1395 – Instance invitations and user
      directory](https://github.com/cryptpad/cryptpad/pull/1395)
  - Alternatively, we can enable admin onboarding
title: Limited account creation
what: prevent malicious users from registering many accounts to bypass the storage
  quotas
who: administrator with limited disk space
why: I can continue to provide a public service for honest users
---
