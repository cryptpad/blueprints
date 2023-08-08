#### Efficient smartphone login

> As a **mobile device user** I want to **generate a short-lived QR code to
> authenticate my secondary devices** so that **I can bypass the slow and
> battery-consuming key derivation process that happens at login**.

Background:

* `scrypt` is designed to consume a lot of resources, so that bruteforcing is
  expensive (impossible)
* Comment [Cryptpad is blank on mobile
  #266](https://github.com/xwiki-labs/cryptpad/issues/266#issuecomment-411040206)
* People probably have regularly a computer besides their phone. They could
  therefore do the key derivation on the computer and then transfer the derived
  value to their phone via a code. As long as they do not log-out, they can
  always read the content.
* Risk: users get confused with this QR code and share it mistakenly with an
  attacker, the only way to redeem is to change the password

