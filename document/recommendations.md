---
title: Security Recommendations for CryptPad
order: 3
tags: document
author: Theo von Arx, Aaron MacSween
date: 2023-03-14
eleventyNavigation:
  parent: Document
  key: Recommendations
  title: Security Recommendations for CryptPad
---

During the writing of the cryptography white paper, we discovered multiple
issues and limitations in the current version of CryptPad. While none of them
are classified severe, requiring immediate action, or posing a serious threat
for users, they nevertheless should be addressed.

In this document, we list the problems, show their consequences, suggest how to
fix them and outline possible drawbacks. We classified them into three different
categories: short-term improvements that can be done immediately within the
current version of CryptPad, mid-term improvements that require the introduction
of a new version of the encryption schemes, and long-term improvements that can
only be addressed with architectural changes.

The file [`prng.js`](prng.js) sketches the idea of generating an "infinite"
stream of derived seeds.


<!-- XXX there is probably a better way of doing the iterations below -->
## Short term improvements

<ul>
{% for rec in collections.recommendations %}
    {% if rec.data.term == "short" %}
        <li><a href="{{ rec.url }}">{{ rec.data.title }}</a></li>       
    {% endif %}
{% endfor %}
</ul>

## Medium term improvements

<ul>
{% for rec in collections.recommendations %}
    {% if rec.data.term == "medium" %}
        <li><a href="{{ rec.url }}">{{ rec.data.title }}</a></li>       
    {% endif %}
{% endfor %}
</ul>

## Long term improvements

<ul>
{% for rec in collections.recommendations %}
    {% if rec.data.term == "long" %}
        <li><a href="{{ rec.url }}">{{ rec.data.title }}</a> </li>      
    {% endif %}
{% endfor %}
</ul>
