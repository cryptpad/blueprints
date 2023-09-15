---
layout: layouts/base
title: Roadmap
tags: chapter
order: 3
id: roadmap
---

<div>

<!-- XXX if text is added as markdown it breaks the mermaid diagram below -->

# Roadmap to the next-generation CryptPad

We explore and outline desired features for the next-generation CryptPad:

* [Revocation](./revocation) for a more fine-grained degree of access control
  e.g. to the document history.
* [Account-recovery](./secretsharing/) mechanism making use of social secret
  sharing.
* [Offline-first editing](./yjs/README.md) by the use of Conflict-free
  Replicated Data Types (CRDTs).

An integral part is to plan how these features can be integrated with CryptPad
in terms of security, usability and performance; and how the current platform
can be migrated to use them. We prototype the above functionalities
to anticipate potential hurdles and estimate the needed implementation effort.
We anticipate that some features such as perfect forward secrecy and CRDTs may
be accessible for users as a demo. For other features like social secret
sharing, which are probably new to most of our users, we will create mock-ups to
surface issues and questions in user experience.
</div>

<pre class="mermaid">
graph LR
{%- for item in collections.roadmap %}
  {{item.data.id}}[{{item.data.title}}]{% if item.data.link-to %}-->{{item.data.link-to}}{% endif %}
  click {{item.data.id}} href "{{item.url}}"
{%- endfor %}
</pre>

<style>
.nodeLabel {
  text-decoration: underline;
  color: blue !important;
}
</style>

<script type="module">
  import mermaid from '/node_modules/mermaid/dist/mermaid.esm.mjs';
  mermaid.initialize({
    startOnLoad: true,
  });
</script>
