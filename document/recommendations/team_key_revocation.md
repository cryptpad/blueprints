---
title: Team Key Revocation
term: long
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

The keys of team drives are static and will never change.

### Consequences:

Once a user is kicked from a team, the user does not lose the keys.
Since are not prevented from subscribing to any Netflux channel, they
can still receive all messages and also decrypt them with their kept
keys. Hence, they do technically not lose access to the team drive.

### Suggestions:

When someone is kicked from a team, the admin has to automatically
create a new key pair and distribute it *privately* to all members.

### Drawbacks:

