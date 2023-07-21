---
layout: layouts/main
title: CryptPad Blueprints
---


# CryptPad Blueprints

Mermaid roadmap code

<pre>
    <code>
graph LR <br>

{%- for item in collections.roadmap -%}
&emsp;&emsp;{{item.data.id}}[{{item.data.title}}]{% if item.data.link-to %}-->{{item.data.link-to}}
{% endif %}

{%- endfor -%} 
    </code>
</pre>


