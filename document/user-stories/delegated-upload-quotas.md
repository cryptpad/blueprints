---
category: Honest user stories
extra:
  acceptance criteria:
  - done: false
    title: The upload is limited in size
  - done: false
    title: The form author is not the owner of the uploads
  - done: false
    title: Ideally there is a system where registered users can arbitrarily delegate
      their quota
  background:
  - To protect from DoS attacks, we only allow registered users to upload files
  - Registered form authors could delegate their right and allow unsigned users to
    upload files on their behalf
  - The form author should not be the owner, as otherwise malicious user can put illegal
    content to other users
  issues:
  - reference: 790
    title: Allow file upload in forms
goal: people can submit images/files as part of their response
title: Delegated upload quotas
what: add an upload question to my form
who: registered form author
---