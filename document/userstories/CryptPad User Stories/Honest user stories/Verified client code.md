### Verified client code

> As a **journalist** I want to **use CryptPad via a verified client** so that
> **I am protected against malicious JavaScript deployed by the server**.

Background:

* Since the server delivers the client code, and there is currently no way to
  verify this code, we require trusting the server.
* Distributing the code out-of-band or making it verifiable is the first and
  most important step to drop the _honest-but-curious_ attacker model and to
  assume an active attacker
* Issues:
  * [Are local-instance federation or client applications on the roadmap?
    #288](https://github.com/xwiki-labs/cryptpad/issues/288)
  * [Clients / API #203](https://github.com/xwiki-labs/cryptpad/issues/203)

Acceptance Criteria:

* [ ] Users can verify the client code without technical knowledge, e.g., with a
  browser add-on or a local client
* [ ] The client code should work for third-party instances
* [ ] Documents should be accessible over the web (e.g., <https://cryptpad.fr>)
  without any additional hurdle

