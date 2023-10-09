#### Delegated upload quotas

> As a **registered form author** I want to **add an upload question to my
> form** so that **people can submit images/files as part of their response**.

Background:

* To protect from DoS attacks, we only allow registered users to upload files
* Registered form authors could delegate their right and allow unsigned users
  to upload files on their behalf
* The form author should not be the owner, as otherwise malicious user can put
  illegal content to other users
* Issue [Allow file upload in forms
  #790](https://github.com/xwiki-labs/cryptpad/issues/790)

Acceptance Criteria:

* [ ] The upload is limited in size
* [ ] The form author is not the owner of the uploads
* [ ] Ideally there is a system where registered users can arbitrarily delegate
  their quota

