---
category: Honest user stories
extra:
  - background:
    - '`scrypt` is designed to consume a lot of resources, so that bruteforcing
      is expensive (impossible)'
    - 'Comment [Cryptpad is blank on mobile
      #266](https://github.com/cryptpad/cryptpad/issues/266#issuecomment-411040206)'
    - People probably have regular access to a computer besides their phone.
      They could therefore do the key derivation on the computer and then
      transfer the derived value to their phone via a code. As long as they do
      not log-out, they can always read the content.
    - 'Risk: users get confused with this QR code and share it mistakenly with
      an attacker, the only way to redeem is to change the password'
goal: I can bypass the slow and battery-consuming key derivation process that
  happens at login
title: Efficient smartphone login
what: generate a short-lived QR code to authenticate my secondary devices
who: mobile device user
---
