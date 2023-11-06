---
title: Social Secret Sharing
author: Theo von Arx
date: 2023-03-30
tags: roadmap
id: secretsharing
showtoc: true
---

<!-- markdownlint-disable MD024 -->

## Terms

* **Secret** - the data to be backed up and potentially recovered.
* **Secret owner** - the user to whom the data belongs.
* **Shard** - a single encrypted share of the secret.
* **Custodian** - a user who holds a shard, generally a friend or trusted
  contact of the secret owner.
* **Threshold** - the number of shards required to recover the secret.

## The Problem: Password in CryptPad

* The cryptpad.fr support team regularly receives requests to reset a forgotten
  password.
* There is no way for a simple reset email as the server does neither know the
  email address, nor the password (or the derived keys).
* If users lose their password, nothing can be done, all documents that are not
  shared are lost.

## The Solution: Recovery with Social Secret Sharing

Social Secret Sharing allows users to split their secret into _shards_ and share
them with trusted parties so that a specified threshold of `k` out of `n`
parties need to collaborate to reconstruct the initial secret.

The most promising framework with a JavaScript API is [Dark
Crystal](https://darkcrystal.pw/) written and maintained by the [magma
collective](https://magmacollective.org/). It internally uses
Amber Sprenkels' [sss](https://github.com/dsprenkels/sss) library.

Another library is [secret.js](https://github.com/passbolt/secrets.js) which is
used by [Passbolt](https://www.passbolt.com/).
It is not easily traceable for what purpose it was created: academical, a
(disappeared) company or cryptocurrencies?
It seems less feature-rich than Dark Crystal and is definitely less documented.

The basic idea is not to directly distribute the secret, but rather encrypt it
with a randomly generated key. Then we split the encryption key into shards
s<sub>1</sub>, …, s<sub>n</sub> which we distribute together with the encrypted
secret.
This is visualized in the following diagram:

<pre class="mermaid">
graph TD

Secret --> AE(Authenticated Encryption)

K[Random Key] --> AE --> ciphertext

K --> SSA(Secret Sharing Algorithm)
SSA --> s_1["s<sub>1</sub>"]
SSA --> ...
SSA --> s_n["s<sub>n</sub>"]

ciphertext & s_1 --> custodian_1["custodian<sub>1</sub>"]
ciphertext & s_n --> custodian_n["custodian<sub>n</sub>"]
</pre>

The purpose is that the input to the secret sharing algorithm is uniformly
random, and does hard for the attacker to guess.
Another advantage is that two independently generated sets of shards cannot be
combined, i.e., an adversary having s1 and s1' from two independent sets does
not have an advantage over an adversary having only s1.

## Design choices

### Assumptions

We rely to trust on the following:

* Users will choose custodians that they know and with whom they can communicate
  over a secure out of band (OOB) channel (e.g., Signal, email, ...).
* There will never be `k` out of `n` users that collude, otherwise they can
  directly recover the secret.
* The threat model is the same as in the white paper, e.g., the server is
  considered as an honest-but-curious attacker.

We aim to introduce social secret sharing in a manner that is compatible with
even the strictest CryptPad configuration.
We therefore restrict ourselves by the following:

* The server cannot check whether a given username exists.
* The server cannot store any personal data such as email address, phone number,
  etc.

---

Based on the assumptions above, we have to make a few design choices.

### Consent

There are three ways of distributing:

* No consent: Custodians are not asked at all if they will keep it or not.
* Weak consent: Custodian receives, but can reject shard
* Strong consent: Custodian must first accept before receiving shard

Since we want to only require minimal interaction s.t. the distribution can be
done in an asynchronous manner, we favor "no consent".

### Knowledge about other custodians

The custodians are not required to know who the other custodians are. This not
only makes malicious cooperation among the custodians harder, but also reduces
the risks for custodians to be targeted by an attacker.

The downside is that the custodians cannot recover the secret
and, e.g., delete an account in case that the secret owner is not reachable
(e.g., dead, arrested, ...).

### Threshold

To keep the scheme simple, we propose to set a default threshold of 3 custodians
that are required to recover the secret (Dark Crystal uses 2 for their
[integration into
Briar](https://darkcrystal.pw/assets/dark-crystal-final-report.pdf)).

#### What is the Secret?

There are two options for what we could back up as a secret:

1. The username and the password
2. The output of the Key derivation function (KDF) `scrypt(username, password)`
3. ⭐ The key to a pad that contains the output of the KDF `scrypt(username,
   password)`

While the first one is extremely simple, it has the disadvantage that
maliciously colluding custodians could recover a password that is also used on
other websites, and thus do a lot of harm even beyond CryptPad.

The second one integrates nicely with CryptPad's login
system. This mechanism
could also serve as a precedent for other applications, e.g., to distribute the
derived secret via a QR code to an older mobile device that struggles with key
derivation. However, the only way to make shards "revokable" is by
changing the password which is quite a burden for users. Changing the password
moreover requires setting up and redistributing shards - another laborious
process.

We therefore favour the third option that leverages a layer of indirection. This
has the advantage of making shared secrets revokable without having to change
the password. It is furthermore possible to change the password without having
to redistribute the secret.

The process is the following:

<pre class="mermaid">
graph LR

username/password --> scrypt --> |store in| pad
scrypt --> |access| account

random[random key]   --> |backup| DarkCrystal --> | distribute| custodian_1["custodian<sub>1</sub>"] & ... & custodian_n["custodian<sub>n</sub>"]
random --> | encrypt| pad --> account[full account access]
</pre>

1. The username and password are taken as input for `scrypt`
2. `scrypt`'s output is for accessing the account, and also stored in an
   encrypted pad.
3. This pad is encrypted with a randomly generated key (which the user retains)
4. The credentials for unlocking this pad are divided into shards and
   distributed to custodians. The custodians hence never directly receive
   anything which is deterministically related to the secret owner's password
5. In the event that the secret owner wishes to revoke a shard, they can destroy
   the encrypted pad which would have allowed custodians to access the account

## UI/UX

### Phase 1: Creation and Distribution of the Secret

Users can visit a page allowing them to distribute shards.
This page will guide them throughout the entire setup and advise them on how to
decide wisely.

An open question is, how and when users should be nudged to set up shards.
This cannot be done directly after the account creating, since then they have no
CryptPad contacts.
So it is probably better to nudge them periodically with the option to disable
such notifications permanently.

#### Selecting Custodians

In a first step, users select custodians among their CryptPad contacts.
The main criteria are:

1. They should only select contacts they trust and that they have verified somehow.
   Especially, they need an OOB channel to reach them in case of password loss.
2. The custodians should not all be part of a single circle of friends (e.g., a
   CryptPad team), and ideally not residing in the same legal jurisdiction.
3. The number of custodians should be adequate.

The first point can only be recommended via text. It is important to clarify
that "trusting a peer" does not only mean to trust them not to do anything
malicious, but also to trust that they can competently protect their own account
with, e.g., a strong unique password, and that they will not lose access to
their account.

The second point can partially been checked and users notified.

The most tricky one the last point as there is no optimal numbers of custodians.
More custodians make definitive password loss less probable, but eases malicious
recovery. Here, the interface must simplify things and help users to make
informed decisions. One possibility is to provide some visual feedback for the
selected choice, such as [displaying the probability that the account
cannot be recovered](https://www.vesvault.com/#the-math).

#### Receiving a Shard

When receiving a shard, the user should be notified via CryptPad's notification
system. Users should also have a graphical interface in which they can see a
list of shards they are holding.

Custodians should be able to signal the secret owner that they cannot hold a
shard, e.g., because they decide to leave CryptPad. In this case, the secret
owner should receive a notification over CryptPad's mailbox system. Additionally,
custodians should be encouraged to also inform the secret owner directly over
the OOB channel for fast action. In this case, the secret owner should revoke
all shards and distribute new ones.

#### Revocation and Modification of the Custodian List

In case that a custodian is no more trusted, users can "revoke" a shard.
In the UI, they should just be able to modify the list of custodians.

We could also ask users to include newly added contacts to their lists of
custodians.

### Phase 2: Recovering a Secret

#### Requesting Return of Shards

The user can click "Forgot password" on CryptPad's login page. They are then
redirected to a page with a URL like
<https://cryptpad.fr/lost-password#aRandomlyGeneratedHash> that:

1. lists the instructions on how to do secret recovery:
   1. ⚠️ Be sure to save this link, you will need it later ⚠️
   2. Contact your custodians via a communication channel outside CryptPad and
      give them the URL <https://cryptpad.fr/recovery#AnotherDerivedHash>
   3. Wait for your custodians to click on the link and send you your shard
      back.
   4. Once enough custodians have sent their shard, come back to this site.
2. provides the lists of shards they already received (in case that
   the threshold is fixed, this might be status bar), including the senders
   usernames, and that
3. will them finally allow setting a new password.

#### Sending Shards

When custodians receive a recovery request via OOB communication, they visit the
provided link (e.g., <https://cryptpad.fr/recovery#AnotherDerivedHash>).
They are asked to login (if they are not) and first see a warning that they only
should proceed if they are sure that the request is legitimate and that they have
verified the identity of the person. This is especially important since there is
no technical way to check whether the request is genuine or malicious.
Then they see a list of all shards in their possession. Every shard is
associated to a username and a profile picture that helps them to select the
correct shard.
They select it, and it is automatically sent back internally on CryptPad (no OOB
communication needed).

#### Account Recovery

Finally, the user who lost their passwords accesses
<https://cryptpad.fr/lost-password#aRandomlyGeneratedHash> and sees that enough
shards are sent back.

* Upon successful combination, they see their username and are asked to reset
  their password. Their account is recovered!
* Otherwise they see which shard is bogus, and informed that they should
  either wait for more shards or get into contact with this person.

## Technical implementation

### Phase 1: Creation and Distribution of the Secret

#### Creation

As discussed above, we do not back up the username and password directly, but
only keys for the encrypted pad containing the output of the KDF. We then split
this secret into `n` shards and store the following metadata in the label of
every shard:

* username of the secret owner
* long term public key of the user
* link to the secret owner's profile page
* Issuing time stamp

To avoid that malicious users can modify the shards, and send bogus ones back
later on, the secret holders signs the shards with their private signing key.
Their public verification key is accessible over their profile page.

#### Transport

Secret holders then send the shards to the custodians' mailboxes; this transport
is therefore end-to-end encrypted. Upon the next login, the custodian stores the
shard into a dedicated data structure.

The receiver then checks whether they already have a shard that corresponds to
the public key of the user. If this is the case, they replace the old shard with
the new one.

Furthermore, we limit the size of shards in order to protect against memory
exhaustion.

Dark Crystal
[states](https://darkcrystal.pw/threat-model/#considerations-for-message-transport)
that messages containing shards should be indistinguishable from other messages.
This implies that e.g., random padding and delay should be added. However, in
the context of CryptPad this is out of scope as the attacker cannot get user
related information (except the IP address).

#### Password change

When a user changes a password, then the KDF of the password and the
username will change. Therefore, only the content of the [encrypted
pad](what-is-the-secret?) has to be updated, but no secret sharing process has
to be re-done.

Shards need also to be regenerated in case of adding users to the trusted
custodians. Since we do not allow changing the threshold, a revocation is not
needed.

When secret holders want to revoke shards, e.g., because a custodian has become
corrupted, there are two possibilities:

1. Ask all custodians to locally delete their shard. Corrupted custodians can
   thus no more reach the threshold.
2. Since the above possibility relies on rightfulness deletion of the shards
   (which cannot be verified), users may "force" revocation by destroying and
   re-creating the encrypted pad containing the output of the KDF and password
   under a new key, and only update the shards of corrupted custodians.

The second option is clearly more secure as it does not rely on trust. We
therefore recommend, that this option is used without the possibility for users
to opt for the first one.

### Phase 2: Recovering a Secret

#### Transport of Returning Shards

When clicking on "Forgot password", we redirect users to
<https://cryptpad.fr/lost-password#aRandomlyGeneratedHash> which does not only
provide instructions, but also sets up a temporary mailbox derived from
`aRandomlyGeneratedHash`. This mailbox is only accessible from the provided link.

We furthermore derive a second URL
<https://cryptpad.fr/recovery#AnotherDerivedHash> which contains the necessary
information and keys to write to the temporary mailbox. While we could
technically also store information about the user (i.e., the entered username),
to let custodians automatically select the shards to be sent, we should refrain
from that, otherwise:

* the entered username could be wrong and lead to errors
* the entered username could be maliciously wrong so that custodians are tricked
  to send shards corresponding to another user's login
* custodians may have shards of multiple users with the same username. In this
  case, automatic selection will not work anyway.

This essentially forces secret owners and custodians to communicate about this
in the OOB channel - which is considered good since this channel is potentially
authenticated, while the temporary mailbox channel can by definition not be
authenticated.

Once the custodians receive the link and selected the shard, they send it back
to the temporary mailbox.

#### Account Recovery

The secret owner fetches their own public verification key from their profile
page (that is accessible over the label) to then verify the received shards.
Unverifiable shards are discarded.

_Note_ that this does not exclude the case of a malicious majority that wants to
trick the secret user to recover a bogus secret: the malicious node can just
fake the shards and refer to a different profile page. However, such an attack
is out of scope, since we assume that the majority is not malicious.

Once there are enough verified shards, the secret is recovered, the user must
set a new password, and update the encrypted pad containing the output of the
KDF as before.

<script type="module">
  import mermaid from '/node_modules/mermaid/dist/mermaid.esm.mjs';
  mermaid.initialize({
    startOnLoad: true,
  });
</script>
