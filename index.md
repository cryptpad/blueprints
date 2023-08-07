---
layout: layouts/main
title: CryptPad Blueprints
---


# CryptPad Blueprints

Mermaid roadmap code

<pre class="mermaid">
graph LR
{%- for item in collections.roadmap %}
  {{item.data.id}}[{{item.data.title}}]{% if item.data.link-to %}-->{{item.data.link-to}}{% endif %}
  click {{item.data.id}} href "{{item.url}}"
{%- endfor %}
</pre>
