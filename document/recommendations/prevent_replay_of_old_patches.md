---
title: Prevent replay of old patches
term: short
tags: recommendations
author: Theo von Arx, Aaron MacSween
date: 2023-03-14

---

### Problem:

Malicious users with read access can replay old patches drafted by other
users. Since they have a valid signatures, they will be accepted.

### Consequences:

Malicious users can send old checkpoints and thus reset documents.
Malicious users could also generate a lot of traffic which might result
in a Denial of Service attack.

### Suggestions:

There are multiple approaches:

1.  Add a time stamp to patches and accept them only if they are within
    a certain range to the current time. The time stamps must be in the
    signed part of the message to make them unforgeable.

2.  The server keeps a list of the hash of the last `N` accepted
    messages. Every incoming message is valid if its hash is not in the
    list and if it references the hash of one of messages in the list.

3.  Clients that want to send patches have to first prove to the server
    that they are allowed to do so. For that, the server sends them a
    random value (a *challenge*) which they must sign and return. If
    they succeed, they are marked to have write capabilities and the
    server accepts their patches.

### Drawbacks:

The drawbacks for the different approaches are the followings:

1.  Users with a wrong system time won't be able to produce new patches.

2.  -   The mechanism is fairly complex for the server and `N` has to be
        chosen carefully, and dependent of the number of users with
        right access (the more there are, the bigger the chance of
        simultaneous messages that could result in missing the window).

    -   Some types of data structures built on top of channels (such as
        mailboxes) contain sequences of messages which are independent
        of each other. For these types of channels it could be
        inconvenient to have to know the parent patch. Replay protection
        could therefore be enforced selectively with an attribute set in
        the channel metadata.

3.  The challenge/verification has to be s.t. a
    DoS attack
    (state exhaustion) against the server is not possible.
