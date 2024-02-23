---
category: Honest user stories
extra:
- background:
  - There is currently no way to re-encrypt documents under new algorithms
  - Since documents may contain long-term secrets, they should be protected even against
    new vulnerabilities
- acceptance criteria:
  - title: Shared URLs should still work
  - title: User's are not bothered with crypto details
  - title: There is one button to update _all_ documents
title: ciphersuites
who: high-risk user
what: use the most-secure cryptography for all my documents
goal: my old documents are not readable by modern adversaries with new capabilities
id: ciphersuites
tags: roadmap
linkto: [TweetNaCl]
---
