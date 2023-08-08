#### Passwords

> As a **user without a password manager** I want to **have guidance on how to
> set a good password** so that **I cannot produce a weak one that can easily be
> cracked**.

Background:

* The login keys are derived solely from the password and the username (and
  potentially a per-instance salt). An attacker that can crack a password has
  access to all data.
* [Password rules are
  annoying](https://blog.codinghorror.com/password-rules-are-bullshit/) for
  users, what really matters is the
  [entropy](https://zxcvbn-ts.github.io/zxcvbn)

Acceptance Criteria:

* [ ] Only a few strict rules (e.g., length)
* [ ] Intuitive visualization of how strong a chosen password is
* [ ] Hints on what to do better

