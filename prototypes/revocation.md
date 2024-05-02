---
title: Revocation
tags: roadmap
id: revocation
author: Theo von Arx
demo: https://revocation.blueprints.cryptpad.org/
repo: https://github.com/cryptpad/cryptpad/tree/revocation
date: 2023-03-31
version: "1.0"
showtoc: true
---

<!-- XXX provide some guidance on what to test in the demo -->
<!-- XXX check with Yann that repo branch is hte right on to link -->

## Introduction

Historically, CryptPad has relied primarily on strong encryption to manage
access control. An actor possessing the symmetric key associated with a channel
is generally considered to have irrevocable access to its contents.

In the _real world_ it is fairly common for organizations to have less rigid
confidence:

* Teams can have temporary members.
* Account credentials can be lost or compromised.
* Document access rights can accidentally be delivered to the wrong person.

As of CryptPad `v5.2.1` there are a few ways to deal with this, each with their
own problems:

1. We can copy the document's contents to a new location, distribute it to the
   relevant actors, and destroy the original version.
   * The new document will have a new **seed** from which its channel identifier
     and encryption keys will be derived. This seed is mostly included in
     document link. The old link is therefore broken and only the new one is
     valid.
   * We consider that links between documents can be as important as the
     contents of the documents themselves. Breaking links results in a poor user
     experience.
2. We can apply a password to the original document and distribute the password
   to the relevant actors
   * Document references that include the seed are preserved. However, the
     relevant actors will require the new password to access them - this is at
     least less destructive than (1).
   * Links that directly reference a document's channel (e.g., "safe links")
     will be broken.
3. We can apply an access list to the document which only includes the relevant
   actors
   * Access lists require that actors authenticate as an account or member of a
     team through possession of a relevant private signing key.
   * At present, team signing keys are **not** rotated when a member of a team
     is removed. Thus, access lists for teams fail to enforce team removal.
   * At present, only registered users can be a member of a team or authenticate
     as having a private signing key. Thus, document owners that wish to use
     access lists must exclude guests or coerce them into registering an account
   * Actors having access to a document _and_ controlling the server (e.g., a
     server admin) can effectively circumvent access lists.

These limitations impose a set of requirements:

1. Make access to a document/team revocable
2. Hand-out multiple URLs for the same document to allow backtracking and
   revoking the one that was leaked
3. Protect against kicked (document/team) members that collude with the server.
4. Design a capability system that is flexible enough to handle use-cases we
   don't anticipate

For the purposes of revocation of various access rights in CryptPad we propose to:

1. further subdivide several categories of access control into [more isolated capabilities](#capabilities)
2. establish [key rotation](#key-rotation) as a norm for all document types

We are also considering a variety of [secondary problems](#secondary-problems).

## Capabilities

In this section, we list various channel capabilities and how to enforce them.
We then show how these channel capabilities can be applied to the team roster
and how they can be used to share access in a team.

In the following, we differentiate between **document keys** that are used to
encrypt/decrypt respectively sign/verify the document and its updates.
These keys are the ones that we already use today for every document.

**Capability keys** are the ones used for restricting [access
capabilities](#capabilities) on the server side.

### Channel capabilities

The general idea is to have one key per _access_ per channel. When a user joins
a channel, they authenticate with their private key and the server will give
them the power matching their public key. An _access_ can be

* a link
* a user
* a shared folder
* a team

As both an optimization and a social feature, it probably makes sense for some
capabilities to be conferred with the same key. For example, Alice generates a
`read` key for Bob. That same key can be used to grant Bob `write` access without
needing to deliver a new key. It implicitly conveys to other moderators that
edits by that the two capabilities are controlled by the same actor. In the
event that Bob does something malicious, moderators will probably want to revoke
both capabilities, and it's readily apparent that they are related even without a
human-readable label.
However, we generally do not want that `write` rights imply `read` rights to be as
flexible as possible. Example: Write to a mailbox, but not read it.

There are generally two ways to enforce the access, either using signing keys or
encryption keys. In both cases we operate on a message
`m = [channel ID, session ID]`, where both values are needed to prevent against
replay attacks:

* With **signing keys** the user signs `m` with their private key, so that the
  server can verify whether the signature is valid for the indicated public key.
* With **encryption keys** the user encrypts `m` with their private key and the
  server's public key to a ciphertext `c`. The server then can decrypt `c` using
  the user's public key and the server's private key to check, whether it
  matches the expected value. While this can be used to prove the possession of
  the private key matching the public access key (encryption in TweetNaCl is
  authenticated), there are some caveats:
  * The server's private key must not be known to any user as otherwise they
    could fork ciphertext using this private key and _any_ other user's public
    key.
  * With this scheme, users can only prove their identity to the server, but not
    to multiple parties not sharing a common public/private encryption key pair.
  * However, the advantage of this scheme is that we can reuse encryption keys
    of mailboxes to prove capabilities.

While we tend to prefer the first option due to its simplicity and the
possibility to more easily change primitives, we leave the choice for
implementation.

We discuss the different capabilities throughout the following paragraphs.

#### Create

To prevent the risk of [channel squatting](#channel-squatting) we introduce a
new format for channel identifiers
consisting of a public key. The server should require that actors demonstrate
possession of the corresponding (per-document) private key
before they are allowed to create a document in that location.

While this key gives a lot of power (practically it makes you almighty), it is
safe to drop it as all other rights are stored in other arrays.

The current implementation of access lists implicitly includes owners in the
list of people able to access a document's content, but there may be use-cases
where that is not necessarily desirable: For instance, doctors write notes about
patients that are typically not shared with the patient, but the patient may
request that it be destroyed.

Instead of relying on the implicit and rigid semantics of the _owner role_,
most of the same applications can be accomplished with an explicit configuration
of create, read, write, moderate, and destroy capabilities

#### Destroy

A list of per-document keys indicating the keys that are allowed to destroy the
document.

#### Read

The current implementation of _access lists_ restricts users' ability to _join_ a
channel unless they authenticate with one of the keys that grants access.
Meanwhile, write access is conferred through the distribution of a single
signing key shared among any number of actors. Once an actor possesses that key
it cannot be revoked without also revoking everyone else's access.

We propose to maintain a list of multiple, independently revocable public
keys that confer read access.

We currently enforce access lists on a per-session basis, with sessions being
invalidated (and users kicked from channels) if a change to the access list
invalidates their session.

#### Write

We propose to maintain a list of multiple, independently revokable public
keys that confer write access.

Write access is currently enforced on a per-message basis. In theory, it could
be per-session, however, this is easy to get wrong. If enforced incorrectly, a
clever actor could replay a previously approved message and thus gain the
ability to deliver unvalidated messages.

#### Moderate

Moderators should be allowed to

* Rotate read/write/moderate/destruction keys
* Change [passwords](#who-can-rotate-keys-and-change-passwords)
* Send messages to inform all actors about key rotation ➡ have to know
  mailboxes and correspondence note (username/team name/per-document name given
  by a moderator)
* The correspondence name should not be public as moderators could associate
  de-anonymizing names to shared links (to favour their own convenience over the
  participators' privacy)

Moderators cannot rotate creation keys as these are strictly bound to the channel.

Every change (adding/removing) keys should be documented and associated with
the moderator key. This way, it is completely back-traceable who leaked the
access. For this, we keep a moderator's log.

We refer to [metadata - an example](#metadata---an-example) for a full
description of the moderator's log.

### Delegation

Due to the inherent possibility to give third party access to their keys, users
can always delegate their capabilities. In spite of trying to hinder users to
delegate their capabilities, we therefore propose to allow them to generate new
access keys and append them to the document's metadata.

The access to a document will thus form a tree, as every node can add children
with the same or weaker capabilities to itself. Note that this holds only for
the graph of keys, [not for the graph of people having
access](#multiple-keys-for-the-same-document).

<pre class="mermaid">
graph LR

Document --> Alice --> TopTeam
Document --> Bob --> folder["shared Folder <br> with Friends"] & Charlie
</pre>

To revoke access for, e.g., Bob, the safest option is to revoke the access for
Bob's entire subtree as well. Otherwise, Charlie could again grant Bob.
Nevertheless, we may want to inform Bob's children why their access was revoked
and provide them a way to ask the moderators for new access.

For a full example on how to store this information in the documents' metadata,
we refer to the subsection [Metadata - an example](#metadata---an-example).

### Team capabilities

The same capabilities also hold for team, and we can apply the proposed channel
capabilities to the access of the team roster:

| Role    | Read | Write           | Moderate | Destroy | Create |
| --------|:----:|:--------------- |:--------:|:-------:|:------:|
| Viewers | ✅   |  ✅ (1)         |   ❌     | ❌      |  ❌    |
| Members | ✅   |  ✅             |   ❌     | ❌      |  ❌    |
| Admins  | ✅   |  ✅             |   ✅     | ✅      |  ❌    |
| Owners  | ✅   |  ✅             |   ✅     | ✅      |  ✅    |

(1): Viewers need to be able to confirm an invitation to a team, and also to
enter their keys when being added via a link. The peers have to check that they
perform only these legitimate actions, and ignore any illegitimate ones. After
this initial phase, write rights can be withdrawn from the viewers.

What is, however, more tricky is to grant teams access to channels which we
discuss below.

#### Pin

The pin capability allows adding a document to the team drive.
This is just another capability that can be distributed independently of the
ones above.

#### Authentication for shared access

Instead of granting a single user read access to a channel, this might also be
done for entire teams. In the following, we assume that _Alice_ wants to give
_TopTeam_ read access to a document of which she is a moderator. _Bob_ is an
editor of this team.

Alice just generates key pairs and adds them to the read/write/moderate
arrays. She then distributes a reading key to Bob. Bob can then add this
document to the team's drive so that all members can access Alice' document.

To distinguish among the different rights associated to team members (e.g., read
or write), Alice needs to send Bob multiple keys. Bob then redistributes them to
a team's reading and writing inbox.

When the team internally changes, then a team admin has to update the access keys
of the shared document.

Pros:

* Simple
* Teams are indistinguishable from normal users
* Alice does only see when a change in a team happens, but does not see who was
  kicked

Cons:

* Revocation is hard:
  * Kicking somebody out of a team requires going through all shared documents.
    This can partially be mitigated by rotating shared documents on demand,
    i.e., as soon as a team member opens the document, they can rotate the keys.
  * Who should be able to rotate keys? If everyone with access to the reading
    key can also change it, then malicious users can exclude other users by
    rotating the keys but not distributing them. Most importantly, a kicked
    member should not be able to rotate the keys. Other, more complicated
    mechanisms (e.g., [threshold capabilities](#threshold-capabilities)) would
    be required.

A potential way out, which involves however even more complexity, is to require
team members that access a document over a team's link to prove that they are
currently part of the team. Unfortunately, teams are no more indistinguishable
from regular users in the metadata.

Currently, you can only share a document with a team if you are part of it. It
is therefore not possible that a user _Alice_ can directly share with a
team _TopTeam_. What she can do, however, is to share it with _Bob_ who
is a member of TopTeam. Bob can then decide whether he wants to add it to
_TopTeam_'s drive.

With the proposed changes, this would
essentially be the same. However, we can think of a new feature in which teams
have their own mailboxes (one per capability) that allows to directly share a
document with a team.

### Creating the document

#### As a registered user

All keys are generated from independent, random seeds. That way the
capabilities are strictly separated.

More specifically, the following keys need to be generated during the document
creation:

1. Capability keys:
   1. The creation signing key pair, of which the public key is used as the
      channel ID (to prevent squatting in the future)
   2. An array of [read](#read) key pairs (per-document signing
      key pairs which allow viewers to authenticate themselves in a server
      session)
   3. An array of [write](#write) key pairs (per-document signing
      key pairs which are used by editors to sign every message they author in
      this context)
   4. An array of [moderate](#moderate) key pairs (per-document
      key pairs allowing to modify the access list and metadata of the document).
   5. An array of [destroy](#destroy) key pairs (per-document
      signing key pairs allowing to prove destroy right to the server)
2. Document keys:
   * symmetric encryption key
   * asymmetric signing key pair (this is not strictly needed, editors could use
     their edit signing key pair to sign patches. The server verifies them and
     removes the signature).

The document creator adds then itself to all mailboxes (default) to guarantee
that they have full capabilities. The document creator can, however, resign from
certain capabilities as soon as they want.

#### As an unregistered user

Mostly the same as above, except that we want everything the document to be
accessible from a URL so that unregistered users can bookmark the information.

We do however not want to encode moderator keys into the URL, as this makes it
highly likely that moderator keys are accidentally leaked.

A better approach is therefore to generate an edit link and replace the
browser's URL bar with this link. The moderator link should still be accessible
over the UI. This way we ensure that moderator keys are not easily leaked while
we provide some basic edit access for users in possession of the shared URL.

### Sharing a document

The procedure to share the access to a document is as follows:

1. Create a mailbox
2. Independently generate keys for the intended capabilities and send these keys
   to the created mailbox
3. Update the metadata of the document
4. Deliver the message conferring access to the generated mailbox to the user
   either via their existing mailbox or via a URL

### Metadata - an example

We illustrate the metadata along the following example:

1. The "creator" creates the pad, and adds keys to the metadata and moderator log
2. The "creator" shares full rights with "firstModerator"
3. "firstModerator" shares the pad with "firstEditor", and gives them read and
   write capabilities
4. "firstEditor" shares the pad with "delegatedEditor", and gives them read and
   write capabilities
5. "delegatedEditor" shares the pad with "delegatedViewer", and gives them the
   read-only capability
6. "firstModerator" rotates the document keys
   * they send the new encryption key to all moderators, editors, and viewers
   * they send the signing keys to all moderators, and editors, but not to
     the viewers.
7. "firstEditor" moves the pad to a shared folder. This implicitly creates the
   new accesses "sharedFolderEdit" and "sharedFolderView"
8. "creator" leaves the company and a moderator revokes their key
   * the keys are rotated
   * users won't accept keys rotated by "creator" anymore
9. "firstModerator" decides to setup a new password

<pre class="mermaid">
graph LR

Creator["1️⃣  Creator"] --> |"2️⃣"| firstModerator["firstModerator <br> 6️⃣ Rotate
<br> 9️⃣ Change password"]
firstModerator --> |"3️⃣"| firstEditor --> |"4️⃣|"| delegatedEditor --> |"5️⃣"| delegatedViewer
firstEditor --> |"7️⃣"| sharedFolder --> SharedFolderEdit & SharedFolderView
firstModerator --> |"8️⃣ Revoke"| Creator
</pre>

At the end of this process, the metadata will look as follows:

```javascript

{
  "access": {
    // The following entry is removed in 8️⃣, we list it for better comprehension
    // creatorPubKey: { // a verification key, here equal to chanID
    //     "rights": "rwmd",
    //     "contact": {
    //       "mailboxChan": mailboxChanEncrypted1,
    //       "encryption key": mailboxPubKey1
    //     },
    //     "notes": encryptedString,
    //     "delegatedTo": firstModeratorPubKey,
    // },

    // 2️⃣
    firstModeratorPubKey: { // public verification key
      "rights": "rwmd", // read, write, moderate, destroy
      "contact": { // how to contact this moderator
        "mailboxChan": mailboxChanEncrypted2, // so that server cannot read
        "encryption key": mailboxPubKey2 // the public key to encrypt for this mailbox
      },
      "label": enc("Mike", documentKey), // an encrypted identifier
      "delegatedFrom": creatorPubKey, // Who gave this key access
      "delegatedTo": [firstEditorKey] // To whom this key delegated the access
    },

    // 3️⃣
    firstEditorKey: {
      "rights": "rw",
      "contact": {
        "mailboxChan": mailboxChanEncrypted3,
        "encryption key": mailboxPubKey3
      },
      "label": enc("Elena", documentKey)
      "delegatedFrom": firstModeratorPubKey
      "delegatedTo": [delegatedEditorKey]
    },
    // 4️⃣
    delegatedEditorKey: {
      "rights": "rw",
      "mailbox": mailboxChan4,
      "contact": {
        "mailboxChan": mailboxChanEncrypted4,
        "encryption key": mailboxPubKey4
      },
      "label": enc("Daniel", documentKey)
      "delegatedFrom": firstEditorKey,
      "delegatedTo": [delegatedViewerKey]
    },

    // 5️⃣
    delegatedViewerKey: {
      "rights": "r",
      "contact": {
        "mailboxChan": mailboxChanEncrypted5,
        "encryption key": mailboxPubKey5
      },
      "label": enc("Dalva", documentKey)
      "delegatedFrom": delegatedEditorKey,
      "delegatedTo": [SharedFolderView, SharedFolderEdit]
    },

    // shared after the rotation (6️⃣):
    // 7️⃣
    sharedFolderViewKey: {
      "rights": "r",
      "contact": {
        "mailboxChan": mailboxChanEncrypted6,
        "encryption key": mailboxPubKey6
      },
      "label": enc("Shared Folder by Dalva", documentKey),
      "linked": sharedFolderViewKey,
      "delegatedFrom": firstEditorKey,
    },
    // 7️⃣
    sharedFolderEditKey: {
      "rights": "rw",
      "contact": {
        "mailboxChan": mailboxChanEncrypted6,
        "encryption key": mailboxPubKey6
      },
      "label": enc("Shared Folder by Dalva", documentKey),
      "linked": sharedFolderViewKey,
      "delegatedFrom": firstEditorKey,
    },
  },

  "moderatorsLog":
  [
    // 1️⃣
    [ "INIT", creatorPubKey ],

    // 2️⃣
    [
      "ADD",
      hash(previous_message),
      firstModeratorPubKey,
      sign(["ADD", firstModeratorPubKey, hash(previous message)], creatorPrivKey)
      creatorPubKey,
    ],

    // 6️⃣
    [
      "ROTATE",
      hash(previous message),
      hash(new symmetric document encryption key),
      new asymmetric document validation key,
      uid, // a unique ID for easier reference
      sign(
        [
          "ROTATE",
          hash(previous message),
          hash(new symmetric document encryption key),
          new asymmetric document validation key
          uid,
        ],
        firstModeratorPrivKey),
        firstModeratorPubKey
    ],

    // 8️⃣
    [
      "REMOVE",
      hash(previous message),
      creatorPubKey,
      sign(["REMOVE", hash(previous message), creatorPubKey], firstModeratorPrivKey),
      firstModeratorPubKey
    ],

    // 9️⃣
    [
      "PASSWORDCHANGE",
      hash(previous message),
      hash(new password + chanID), // concatenate password and channel ID
      uid, // a unique ID for easier reference
      sign(
        [
          "PASSWORDCHANGE",
          hash(previous message),
          hash(new password + chanID),
          uid,
        ],
        firstModeratorPrivateSignKey),
      firstModeratorPubKey
    ],
  ]
  ]
}
```

Explications:

* `access`:
  * every entry is identified by a public signing key
  * `rights` indicate the channel capabilities the user has, i.e., **r**ead,
    **w**rite, **m**oderate, or **d**elete
  * `contact` includes all details to contact this user at its ephemeral
    mailbox. This includes the mailbox channel (encrypted by the document key to
    hide it from the server), and the public encryption key belonging to this
    mailbox.
  * `label` indicates a name given by the parent node. The server should not
    be able to read it, we therefore encrypt it with the document keys. To
    favor privacy, the server serves non-moderator users only with their
    subtree.
  * `linked` indicates other keys that are directly tied to this mailbox. This
    includes not all siblings, but only certain types such as the read and the
    view access for a shared folder.
  * `delegatedFrom` indicates the signing key of the parental node who shared
    access with this key.
  * `delegatedTo` indicates the signing keys of the children of this node
* `moderatorsLog`:
  * The **`INIT`** message indicates the root of trust, the
    `ownerPublicVerificationKey` which is the same as the `chanID` (this message
    is not strictly needed).
  * Every consecutive message includes:
    * the action type
    * the hash of the previous one to guarantee the ordering, i.e., we do neither
      rely on time nor on the server for this.
    * a signature of all other components by signature key that is valid at this
      point in time. This guarantees that the content is not malleable. However,
      the server can drop the last messages. To prevent this, users should store
      the hash of the latest message in their drive.
    * the public key that signed the message to make the signature more easily
      verifiable.
  * Depending on the action type, there are the following additional values:
    * **`ADD`** messages include the public verification key corresponding to the
      newly added moderator.
    * **`REMOVE`** messages include the public verification key corresponding to
      the removed moderator.
    * **`ROTATE`** messages indicate a [key rotation](#key-rotation). We add the
      hash of the new document encryption key to allow users to check that the key
      they received is the correct one. We also add the new public verification
      key for the same reason. Furthermore, we add a unique identifier (`uid`)
      to facilitate referring to this message, e.g., from a mailbox message.
    * **`PASSWORDCHANGE`** messages indicate a password change. We add the hash of
      the password and use the channel ID as a salt (to prevent [rainbow table
      attacks](https://en.wikipedia.org/wiki/Rainbow_table)). This message allows
      users to easily verify whether they know an old password to decrypt history.
      Furthermore, we also add a unique identifier (`uid`) to facilitate
      referring to this message, e.g., from a mailbox message.

## Key rotation

Key rotation is the action of agreeing on new keys to
encrypt/decrypt/sign/verify documents.
In this section, we first show several use cases to then discuss the transport
of the document keys. Next, we show how we can rotate the capability keys.

### Motivation and Use Cases

One of the problems of CryptPad's access control is, that the keys (e.g., used to
encrypt a document, decrypt team messages or prove membership of a team) are
static.

This implies the following use cases:

#### Hiding document history or the chat history

Alice has worked for several hours on a draft of something she wants to share
with Bob. It has a number of embarrassing mistakes in its history that she
doesn't want Bob to see. Rather than creating an entirely new document with the
final content (and loosing all the history), she can add a checkpoint of the
document's history in place, rotate its key, and only share the latest key with
Bob.

The same logic could be applied to the drive's history, shared folder, or chat
history, i.e. if someone is invited to a team but should not see every document
the team ever created.

This could also be applied to shared mailboxes or special structures like the
support ticket mailbox: when a person leaves the instance admin team, a basic
thing to do is rotating the key so that ex-admins cannot decrypt messages
received after their departure.

#### Keys compromised by powerful adversaries

Users can not rely on the server to enforce the read/write capabilities in,
e.g., the event that:

1. the decryption key is shared with the server support team (who can bypass
   conventional access control if they want)
2. Police (or some other actor that could gain server access) seizes a user's
   device or otherwise gain encryption keys

In both of the above cases, rotation of the **encryption** key cryptographically
prevents the adversary from reading the new updates.

#### Cryptosystem upgrade

Alice created a document a long time ago, but the NSA/Google/Whoever have since
developed very powerful quantum computers and Alice would like to change
ciphers. This can be communicated via the same mailboxes.

Alice will probably also want to rotate other types of keys (destroy, moderate,
etc.). However, the `create` keys cannot be migrated because they are not
_arrays_, but hard-coded, immutable relationships. Note that upgrading other keys
to prevent seizure while leaving the file in place will prevent squatting of the
namespace.

#### Impersonation

Alternatively, if Alice generates a write key for Bob, she can impersonate him
and make it appear as though he wrote things he did not. For this reason, Bob
might want to request that Alice replaces the issued key with a key that he
generated for himself. To prove that it was really him (and not Alice) who
replaced the key, Bob needs to sign this action with a key that is publicly
associated to him, i.e., his long-term signing key.

### Document Keys

#### Transport

We can send document keys directly to the per-document mailboxes of users and/or
teams we are granting access. They are encrypted and secured by asymmetric
encryption keys. Note that the transport for [guests](#sharing-a-document) has
to be done slightly different.

Advantages:

1. We have a unified way to communicate keys.
2. We can create multiple URLs for the same document. This is useful for traitor
   tracing: we can trace back the leakage of a URL to the small group we gave
   access to the mailbox. This also allows withdrawing access for a shared URL.

Disadvantages:

1. Increased latency when opening a document since you need to load the mailbox
   messages to get the most recent keys, then open the related document. Some of
   this could probably be parallelized to some degree with undecipherable
   messages being queued.
2. Increased fragility:
   1. A server-side delay in opening either channel will result in slower
      loading or reconnection times.
   2. Client-side bugs resulting in a silent failure to reconnect could cause
      very annoying issues.
   3. Service interruptions affecting the user(s) responsible for delivering
      keys to mailboxes can result in inconsistencies, i.e., most users become
      aware of the key rotation, but a subset does not. The protocol for the
      actual document's encryption should probably include some information
      ensuring that they converge.

To keep the existing feature of passwords, we propose to not generate keys
entirely independent, but as well from a seed, i.e.:

```javascript
function generateKeys(password) {
  write_seed = getRandomBytes(32)
  read_seed = getRandomBytes(32)

  write_key = hash(write_seed + password) // concatenate
  read_key = hash(read_key + password) // concatenate

  return {write_key, read_key}
}
```

This way, we do not rotate keys directly, but rather the seed. The password can
then basically be handled the same way as it is currently done: transfer out of
band when the access is shared via link or send it along the keys when a
document is shared via mailboxes.

#### Who can rotate keys and change passwords?

The risks of malicious actors rotating keys and changing passwords:

* To send the new keys to all previous viewers/writers, the rotator needs to
  know them (or at least their public keys). This information should **not** be
  available to anyone working on the document, but only to moderators.
* Exclude legitimate actors from updates.

Consequently, the keys should not be rotatable by anyone, but rather only by
[moderators](#moderate). To ensure this, we add `ROTATE` messages to the
moderator's log containing the hash of the symmetric key, respectively the
public key in case of rotating a key pair. User's can then check whether the keys
received in the mailbox actually match the ones of the moderator's log.

Nevertheless, everybody should be able to request that keys are rotated, in case
that their key has been compromised.

#### When are keys rotated?

**Event-driven**: Keys should be changed when the following events happen:

1. Giving someone new access to the document to hide history from them.
2. Withdrawing someone's access to prevent them to read future updates by
   colluding with the server

### Capability Keys

Due to above reasons, they should also be changed on a regular basis.

In principle, every user should be able to replace their own keys by adding
their new keys to the metadata. Here, the server should enforce that users can
only modify their own keys.

However, this is trickier for moderators as their keys are much more sensitive.
An existing moderator must therefore sign their action
with their moderation signing key and append it to the moderator's log.

## Secondary problems

### Channel squatting

CryptPad's current document links (except safe links) include all the information
needed to create the document (i.e., the channel ID, as well as the
cryptographic key). A document can therefore be recreated at the place of an
old one. A malicious actor can abuse this along the following lines:

1. Alice creates a document and references it from another place (e.g., another
   document, a website) via its edit link.
2. Mallory sees the link and stores it.
3. Alice decides to destroy the document but forgets to also delete its
   reference.
4. Mallory creates a new document at the same place and puts compromising
   content in it.
5. Victims will visit the new document via the old reference on Alice' site.

This can be prevented through the introduction of a new ['create' capability](#create).

Another option would be to let the server randomly choose a `chanID`. While this
would correctly prevent channel squatting, it makes it easier for a user to
request thousands of channels, compared to the proposed change involving
cryptographic proofs.

### Trust server to grant access

With the proposed changes we need to trust the server to honestly grant access,
i.e.:

1. not to deny rightful access.
   This is reasonable, since we **always** need to trust the server to
   rightfully serve content.
2. to correctly deny illegal access.

These limitations are, however, covered in the current threat model in which we
consider the server as an honest-but-curious attacker.
Nevertheless, we strive to trust the server only when it is absolutely needed.

### Duplication of effort and a path to federation/p2p

The server is responsible for enforcing aspects of the access control policy
(e.g., edit rights, the current implementation of access lists, ownership and
its permissions, the proposed implementation of various capabilities).

Meanwhile, the client enforces access through strong encryption and the secure
distribution of key material. This duplication of effort can be seen as a
concern in a few different ways:

1. Development effort is duplicated across multiple methods of accomplishing
   similar tasks.
2. A wider range of controls are exposed to users who must understand their
   purpose to apply them correctly.
3. The inclusion of features which directly depend on server authority makes it
   more challenging to migrate towards a federated or p2p architecture in the
   future, either because the feature needs to be reimplemented without that
   implicit authority or because the feature needs to be dropped and its UI
   adjusted.

Likewise, there are a few basic responses:

* While there is some overlap in the general functionality, the two approaches
  handle different types of threats. The server's authority is leveraged to
  prevent abuse from malicious users regardless of what keys they possess, while
  the encryption is intended to prevent the server from compromising the
  confidentiality, integrity, or authenticity of the content.
* Even in cases where there is direct overlap, that redundancy makes it less
  likely that users will be adversely affected in the event of a failure of one
  of those components.

_Note:_ if we ever want to move towards a p2p model we'll effectively have to
implement a certificate authority and transparency for changes to access...

### Multiple keys for the same document

With the proposed system, a user might have multiple different keys to access
the same document with different rights (e.g., they got privately got a
moderator key, and then a read-only link from a public channel). In such a case,
we want to store all keys (in case that some are revoked), but access the
document with the most powerful one.

Currently, users can right-click a document to then select between `Open` and
`Open (read only)`. To keep this possibility, we just go through every
mailbox associated to the document, and stop as soon as we find the most
powerful key. The read-only option can then easily be covered by corresponding
UI.

Also note that it is therefore possible, that the graph of persons having
access to a document might not be a tree:

<pre class="mermaid">
graph LR
Document --> A[Alice <br> K<sub>A</sub>] & B[Bob <br> K<sub>B</sub>]
A --> C[Charlie <br> K<sub>C1</sub> & K<sub>C2</sub>]
B --> C
</pre>

while the graph of delegated keys still forms a tree:

<pre class="mermaid">
graph LR
Document --> A[K<sub>A</sub> ] & B[K<sub>B</sub> ]
A --> K_C1[K<sub>C1</sub>]
B --> K_C2[K<sub>C2</sub>]
</pre>

Unfortunately, there is no technical solution to this problem as we can not
ensure that a person does never obtain two different keys to the same document.
Also, the receiver should always keep all accesses, in case that one is revoked
or demoted.

### Threshold capabilities

Teams might want to set a threshold for certain actions, e.g., `k` out of `n`
members are required to destroy a document. The proposed system is easily
modifiable to handle such threshold capabilities: the server only needs to keep
track of the number of needed signatures until the action is finally executed.
The advantage is that we do not need to implement threshold signatures which
introduce additional complexity. Moreover, we anyway rely on the server to
ultimately decide on when to destroy a document. We therefore do also not
introduce any additional trust assumptions.

### Wording: Deletion, destroy, trash, and archive

Currently, "deletion" is used for two things:

* to speak of `rm`ing a document on the server
* to move a document to the trash in the CryptPad UI

We further use "destroy" to make a document no more accessible from the CryptPad
UI. However, this does only _archive_ (`mv`) the document on the server side.

We therefore propose to speak of "destroy" rights when speaking about making a
document inaccessible.

<script type="module">
  import mermaid from '/node_modules/mermaid/dist/mermaid.esm.mjs';
  mermaid.initialize({
    startOnLoad: true,
  });
</script>
