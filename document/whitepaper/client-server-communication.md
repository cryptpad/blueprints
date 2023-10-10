---
title: Client-Server Communication
---

## Client-Server Communication

In this section, we show how we use the [NetFlux
protocol](https://github.com/openpaas-ng/netflux-spec2/blob/master/specification.md)
to enable communication between web clients and the server.
We discuss the usage of <abbr title="Transport Layer Security">TLS</abbr> that
helps to defend against <abbr title="Machine in the Middle">MITM</abbr> and
impersonation.

Each CryptPad instance makes use of a central server: while not being
able to read any content, the server still acts as an intermediary
between different clients.
This is not only to forward the messages, but also to store them and to
guarantee a highly available persistence layer that would not be possible in a
purely peer-to-peer solution.

Communication between the client and the server is mostly done using a
WebSocket connection based on the NetFlux protocol.
Exceptions are static files (such as images, videos, PDF, etc.) that are stored
in an encrypted format and are retrieved by users with <abbr
title="XMLHttpRequest">XHRs</abbr>.

With the NetFlux protocol, users can join *channels* and send messages
to them.
All users subscribed to a channel will then receive the messages.

Each document is represented on the server by a channel with a unique
32-character hexadecimal identifier called `chanID`. The `chanID` associated
with a document is derived from its URL, so that users knowing the URL can
subscribe to the channel.

While a channel provides a way to communicate messages or changes to a
document, channels do not provide confidentiality or authenticity. We
therefore use TLS to encrypt the messages between the server and the client.
This allows to authenticate the server and therefore rules out
MITM attacks.
It further restricts any network adversary from accessing the encrypted content.

However, TLS on its own is not enough as the encryption is only between the
server and the client, but not between two clients.
TLS can moreover not prevent clients from subscribing to channels they should
not have access to.
To prevent against this, we make use of dedicated encryption schemes hand
tailored to CryptPad.
