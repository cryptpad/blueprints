---
layout: layouts/base
title: CryptPad Blueprints
---

CryptPad is an end-to-end encrypted collaboration suite that has been under
active development since 2015, and is used by hundreds of thousands of people.
Its feature set has grown from a simple editor to a full-blown set of multiple
applications, drive, teams, etc.

We plan to make the next generation of CryptPad even better with stronger
security guarantees, offline-first collaborative editing, and user-driven
workflows like password reset. This project is the first step in this direction.

These future developments will involve significant work to implement. They also
have to be considered in relation to the existing architecture, guarantee access
to all existing data, and preserve a coherent experience for users. Therefore a
migration path has to be carefully outlined to go from the current state of the
product to a proposed "next generation".

With CryptPad Blueprints we propose to thoroughly review the current state of
CryptPad, and to plot the trajectory towards its next generation. This is
done through a series of deliverables outlined below, ranging from a white paper
to technical prototypes.

## Roadmap

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

<hr>

This project is funded through the [NGI0 Entrust](https://nlnet.nl/entrust) Fund, a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement N<sup>o</sup> 101069594.

<p float="left">
  <img alt="NGI0 Entrust" src="https://nlnet.nl/image/logos/NGI0Entrust_tag.svg" width="100" />
  <img alt="NLNet Foundation" src= "https://nlnet.nl/image/logo_nlnet.svg" width="100" />
</p>
