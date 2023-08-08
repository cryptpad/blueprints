---
layout: layouts/base
title: CryptPad Roadmap
tags: chapter
id: roadmap
---

# CryptPad Roadmap

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
