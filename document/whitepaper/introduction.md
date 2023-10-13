---
title: Introduction
eleventyNavigation:
  order: 0
---

CryptPad is an end-to-end encrypted real-time collaboration suite that is used
by hundreds of thousands of people per month.
It is accessible through a web interface which ensures that all data is
encrypted in the browser with no readable user data leaving the local device.
Even the service administrators can therefore not see the content of documents
or user data.

Since CryptPad's inception in 2014, its feature set has grown from
a simple editor to a full-blown set of multiple applications including
forms, spreadsheets, presentation slides,
[kanban](https://en.wikipedia.org/wiki/Kanban) boards, and whiteboards.
Nowadays, CryptPad also features additional collaboration utilities such as
calendars, teams and simple chats.

CryptPad is an open source project with both client and server code
available and licensed under the <abbr title="GNU Affero General Public
License">AGPL</abbr>.[^1]
This means that anyone with the ability to do so is free to use, host, and
modify the software as long as any modifications are made available to their
users under the same terms.
CryptPad is developed by [XWiki SAS](https://xwiki.com), a company based in
Paris, France that has been making open source software since 2004.
The development has been supported since 2015 by French and European research
funding bodies such as BPI France, NLNet Foundation, NGI Trust, and Mozilla Open
Source Support.

Due to the limited information which is exposed to operators of CryptPad
servers, we cannot know exactly which type of users rely on CryptPad and
for what kind of activity it is used.
As several blog posts suggest, among CryptPad's users are
journalists,[^jha22] people working in the health sector,[^interhop21] and
activists.[^times22]<sup>,</sup>[^paris19]
There is also a public instance hosted by Germany's Pirate Party.[^ppg]
This instance was recently seized by police as a consequence of the
publication of sensitive material.[^times22]
Altogether, this shows that higher-risk users rely on the security established
by CryptPad.
The users especially do not want to trust the server as it might be corrupt or
seized due to legal enforcement.

In previous work [^MacSween2018]<sup>,</sup>[^MacSween2019], we described
CryptPad's general architecture and user interface and compared it to other
collaboration tools.
In this document, however, we focus on the cryptographic design that is used to
secure user-generated information such as documents and messages.
We show the desired security properties and how we establish them
cryptographically.
We updated the relevant information on this website to align it with CryptPad's
newest improvements.

The content on this section of the website is structured as follows:

1. Summarizes CryptPad's underlying [threat model](./threat-model/).
2. [Client-Server Communication](./client-server-communication/) explains the
	communication between the server and the client.
3. Notations and used algorithms are described in the [notation](./notations)
	section.
4. We present in the [document](./document/) page the encryption of pads as the
	core functionality of CryptPad.
5. We next show in [CryptDrive](./cryptdrive/) how the login mechanism makes the
	documents easily accessible across multiple devices, but keeps them secure.
6. [Messaging](./messaging/) explains the establishment of secure communication
between different users.
7. Finally, [Teams](./teams/) shows how we enable communication and access
	control within a team.
8. A [conclusion](./conclusion/).

[^1]: Source code: <https://github.com/xwiki-labs/cryptpad>
[^interhop21]: InterHop. 2021. “Our e-Health Software.”
<https://interhop.org/en/projets/esante>.
[^jha22]: Jha, Prateek. 2022. “Russia's Invasion of Ukraine: How to Circumvent
Censorship.”
<https://vpnoverview.com/news/russias-invasion-of-ukraine-circumvent-censorship>.
[^times22]: The Limited Times. 2022. “Data confiscated from Pirate Party
servers.”
<https://newsrnd.com/tech/2022-06-24-data-confiscated-from-pirate-party-servers.SJxeH5I79q.html>.
[^paris19]: Paris, Nicola. 2019. “Tools for More Secure Activism.”
<https://commonslibrary.org/tools-for-more-secure-activism>.
[^ppg]: Pirate Party of Germany. n.d. "Cryptpad.piratenpartei.de."
<https://cryptpad.piratenpartei.de>.
[^MacSween2018]: MacSween, Aaron, Caleb James Delisle, Paul Libbrecht, and Yann
Flory. 2018. "Private Document Editing with Some Trust." In
*Proceedings of the ACM Symposium on Document Engineering 2018*. DocEng
'18. New York, NY, USA: Association for Computing Machinery.
<https://doi.org/10.1145/3209280.3209535>.
[^MacSween2019]: MacSween, Aaron, and Yann Flory. 2019. "Behind the Façade." In
*HCI for Cybersecurity, Privacy and Trust*, edited by Abbas Moallem,
294--313. Cham: Springer International Publishing.
