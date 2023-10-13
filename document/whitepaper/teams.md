---
title: Teams
eleventyNavigation:
  order: 7
---

In this section, we present CryptPad’s team encryption which is similar
to the general messaging encryption, but suitable for the use case where
we want to have fine-grained control over reading and writing access.
We first show how we derive the team’s keys and how we use them for message
encryption and the control of the team’s drive.
Next, we present the different roles and permissions in team and how we enforce
them.

## Key derivation

We want that all users of a team can read messages, but not necessarily
all of them to be able to write to the mailbox. We therefore generate
not only an encryption key pair, but also a signing key pair which
allows proving writing capabilities.

<figure id="fig:team_keys">

TODO

<figcaption>Figure 1: Derivation of team keys</figcaption>
</figure>

The key generation for a team is depicted in <a href="#fig:team_keys"
data-reference-type="ref" data-reference="fig:team_keys">Figure 1</a>.
We sample 18 Bytes uniformly at random for seed and split it into two halves. We
hash the first half and build from this hash the chanID and an
encryption/decryption key pair (PK<sub>T</sub>, SK<sub>T</sub>).
The second half forms the input to KGen<sub>S</sub>(·) which generates a signing
key pair (PK<sub>T,S</sub>, SK<sub>T,S</sub>).

To send a message to a team, the user encrypts it with the same mechanism as
described in [Messaging](../messaging/).
However, the user must set the team’s PK<sub>T</sub> as the public key of the
receiver and use the team’s SK<sub>T,S</sub> as the signing key.

The public signing key is further used to control a team’s drive which
works the same way as one of a single user. For example, we can use the
signing key to pin a document, i.e., to indicate to the server that a
specific document is owned. In the perspective of the server, the public
key of this pin is, however, undistinguishable from the one of a single
user. Based on an offline view of the database (i.e., after a seizure of
law enforcement), the server can thus neither know which entities are
teams, nor can the server match users to teams.

## Roles and Permissions

<table id="tab:roles_and_permissions">

| Role   | View   | Edit   | Manage Members   | Manage Team   |
|:------:|-------:|-------:|-----------------:|--------------:|
| Viewer | ✔️      |        |                  |               |
| Member | ✔️      | ✔️      |                  |               |
| Admin  | ✔️      | ✔️      | ✔️                |               |
| Owner  | ✔️      | ✔️      | ✔️                | ✔️             |

<caption>Table 1: Different roles and their permissions</caption>
</table>

As shown in
<a href="#tab:roles_and_permissions" data-reference-type="ref"
data-reference="tab:roles_and_permissions">Table 1</a>, there are four
different roles in a team: viewers, members, admins, and owners.
The permissions are the following:

- **View:** read-only access to folders and documents.
- **Edit:** create, modify, and delete folders and documents.
- **Manage users:** invite and revoke users, change user roles up to admin.
- **Manage team:** change team name and avatar, add or remove owners, change
	team subscription, delete team.

The number of permissions is strictly increasing, i.e., a role inherits
all access rights from a weaker one, but has one additional permission.

All users keep a local copy of their teams including their rosters. To
manage members and the team itself, admins (respectively owners) send
the corresponding control message to all users of the team. They then
check the authenticity of the message and whether the sender has
sufficient rights to perform the desired action. If this is the case,
then they update their local view of the team.

In order to, e.g., add a new document to the team’s drive, the user
sends the viewing keys to the viewers, and the editing keys to the
teams’ members, admins, and owners.
