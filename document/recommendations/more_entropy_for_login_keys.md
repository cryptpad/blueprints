---
title: More Entropy for Login Keys
term: short
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

Generally, neither the username nor the password provides good entropy.
The only rule imposed on the password is that it should have a minimum
length of 8 characters. Therefore, weak passwords such as `password` are
accepted.

### Consequences:

We use `Scrypt(password, username + InstanceSalt)` to generate the login
keys (master keys). Since these master keys are not generated from a
good source of randomness, attackers can gain access to all documents of
users with weak passwords.

A side consequence is that the probability to register a new account
with the same `username` and `password` combination is not negligible.
If this happens, then users without bad intentions get access to a third
person's drive.

### Suggestions:

Use password strength estimation such as
`zxvbn-ts` [^1] which rates the password strength
on a score from 0 to 4 and provides, guessing times, indicators what
makes the password weak and how it can be improved (see
[1](#fig:zxvbn){reference-type="ref" reference="fig:zxvbn"}). We may
display the password strength estimation and/or require a minimum score.

<!-- XXX check image and caption are displayed properly -->

![The library `zxvbn-ts` provides a score, guess times, warnings, and
suggestions.](../images/zxvbn.png)

### Drawbacks:

Users are annoyed by password requirements.


[^1]: MrWook, and Daniel Lowe Wheeler. 2022. “Zxcvbn-Ts.” https://github.com/zxcvbn-ts/zxcvbn.  
Wheeler, Daniel Lowe. 2016. “Zxcvbn: Low-Budget Password Strength Estimation.” In USENIX SEC ’16. https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler.