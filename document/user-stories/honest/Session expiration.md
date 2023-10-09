#### Session expiration

> As an **activist** I want to **set my session to require frequent
> authentication for new actions** so that **police cannot seize my phone and
> inspect all my data**.

Background:

* Issue [PIN / Password on Open
  #889](https://github.com/xwiki-labs/cryptpad/issues/889)
* Users can stay logged-in, thus anyone with device access will have access to
  the user's CryptPad documents
* Today, users can already disconnect remote devices
* The password to a password-protected pad is stored in the user's drive,
  therefore they need no password to actually open the pad.

Acceptance Criteria:

* [ ] Only selected pads or actions (e.g., team management) should be
  authenticated
* [ ] User's can set a time interval after which they are disconnected

