---
title: CryptPad User Stories
eleventyNavigation:
  order: 4
---


The idea is to have a summary of all the use-cases/capabilities/workflows we
want a future crypto-system to be able to express Format
([wikipedia](https://en.wikipedia.org/wiki/User_story#Common_templates)):

* As a **role** I can **capability**, so that **receive benefit**
* In order to **receive benefit** as a **role**, I can **goal/desire**
* In order to **receive benefit** as a **role**, I can **goal/desire**

## Evil user stories

A template that's commonly used to improve security is called the "Evil User
Story" or "Abuse User Story" and is used as a way to think like a hacker in
order to consider scenarios that might occur in a cyber-attack. These stories
are written from the perspective of an attacker attempting to compromise or
damage the application, rather the typical personae found in a user story:
> As a **disgruntled employee**, I want to **wipe out the user database** to
> **hurt the company**

## Shit user stories

> As a **registered user** I want to **access my drive** but I can't because **I
> forgot my password**.

Background:

* There is no way to reset the password as the server does neither now the
  password, nor the username, nor any other information (such as email).
* Social Secret Sharing can help

> As a **registered user** I want to **find a document I created last week** but
> I can't because **I did not add it to my drive**.

> As a **user with sensitive information in my drive** I want to **keep my data
> secure** but I can't because **I did not log out of CryptPad before police
> seized my laptop**.

{% for story in user-stories %}
  {{ story.title }}
{% endfor %}



<!-- {% for story in collections.user-stories %} -->
<!--   {{ story.url }} -->
<!-- {% endfor %} -->

<!-- 
* [Honest user stories](<./CryptPad User Stories/Honest user stories/>)
  * [Security for a single user](<./CryptPad User Stories/Honest user stories/Security for a single user/>)
    * [Passwords](<./CryptPad User Stories/Honest user stories/Security for a single user/Passwords/>)
    * [Session expiration](<./CryptPad User Stories/Honest user stories/Security for a single user/Session expiration/>)
    * [Uncorrelated ownership](<./CryptPad User Stories/Honest user stories/Security for a single user/Uncorrelated ownership/>)
  * [Verified client code](<./CryptPad User Stories/Honest user stories/Verified client code/>)
  * [Ciphersuites](<./CryptPad User Stories/Honest user stories/Ciphersuites/>)
  * [Guest ownership](<./CryptPad User Stories/Honest user stories/Guest ownership/>)
  * [Collaboration](<./CryptPad User Stories/Honest user stories/Collaboration/>)
    * [Explicit membership](<./CryptPad User Stories/Honest user stories/Collaboration/Explicit membership/>)
    * [Delegated upload quotas](<./CryptPad User Stories/Honest user stories/Collaboration/Delegated upload quotas/>)
    * [Guest participation](<./CryptPad User Stories/Honest user stories/Collaboration/Guest participation/>)
    * [Contributor attribution](<./CryptPad User Stories/Honest user stories/Collaboration/Contributor attribution/>)
    * [Account verification](<./CryptPad User Stories/Honest user stories/Collaboration/Account verification/>)
  * [Share/Access](<./CryptPad User Stories/Honest user stories/ShareAccess/>)
    * [Sharing over insecure channels](<./CryptPad User Stories/Honest user stories/ShareAccess/Sharing over insecure channels/>)
    * [Revokable links](<./CryptPad User Stories/Honest user stories/ShareAccess/Revokable links/>)
    * [Traitor tracing](<./CryptPad User Stories/Honest user stories/ShareAccess/Traitor tracing/>)
    * [Bulk settings updates](<./CryptPad User Stories/Honest user stories/ShareAccess/Bulk settings updates/>)
    * [Protecting history](<./CryptPad User Stories/Honest user stories/ShareAccess/Protecting history/>)
    * [Access History](<./CryptPad User Stories/Honest user stories/ShareAccess/Access History/>)
  * [Handy Features](<./CryptPad User Stories/Honest user stories/Handy Features/>)
    * [Full-text search](<./CryptPad User Stories/Honest user stories/Handy Features/Full-text search/>)
    * [Efficient smartphone login](<./CryptPad User Stories/Honest user stories/Handy Features/Efficient smartphone login/>)
    * [Document format upgrade](<./CryptPad User Stories/Honest user stories/Handy Features/Document format upgrade/>)
    * [Resume file upload/download](<./CryptPad User Stories/Honest user stories/Handy Features/Resume file uploaddownload/>)
    * [File system sync](<./CryptPad User Stories/Honest user stories/Handy Features/File system sync/>)
    * [CLI API](<./CryptPad User Stories/Honest user stories/Handy Features/CLI API/>)
    * [Private Message notifications](<./CryptPad User Stories/Honest user stories/Handy Features/Private Message notifications/>)
    * [Stable server connection](<./CryptPad User Stories/Honest user stories/Handy Features/Stable server connection/>)
  * [Teams](<./CryptPad User Stories/Honest user stories/Teams/>)
    * [Bulk team onboarding](<./CryptPad User Stories/Honest user stories/Teams/Bulk team onboarding/>)
    * [Privileges and Roles](<./CryptPad User Stories/Honest user stories/Teams/Privileges and Roles/>)
* [Admin stories](<./CryptPad User Stories/Admin stories/>)
  * [Limited account creation](<./CryptPad User Stories/Admin stories/Limited account creation/>)
  * [Admin onboarding](<./CryptPad User Stories/Admin stories/Admin onboarding/>)
* [Evil user stories](<./CryptPad User Stories/Evil user stories/>)
  * [Account impersonation](<./CryptPad User Stories/Evil user stories/Account impersonation/>)
  * [Malicious javascript](<./CryptPad User Stories/Evil user stories/Malicious javascript/>)
    * [Malicious JS - DNS variant](<./CryptPad User Stories/Evil user stories/Malicious javascript/Malicious JS - DNS variant/>)
  * [Honeypot operator](<./CryptPad User Stories/Evil user stories/Honeypot operator/>)
  * [Police informant](<./CryptPad User Stories/Evil user stories/Police informant/>)
  * [Terrorist cells](<./CryptPad User Stories/Evil user stories/Terrorist cells/>)
* [Shit user stories](<./CryptPad User Stories/Shit user stories/>)
  * [Ownership](<./CryptPad User Stories/Shit user stories/Ownership/>)
  * [Loading docs on mobile](<./CryptPad User Stories/Shit user stories/Loading docs on mobile/>)
  * ["Access lists" without "access"](<./CryptPad User Stories/Shit user stories/Access lists without access/>)
  * [Uncertain folder membership](<./CryptPad User Stories/Shit user stories/Uncertain folder membership/>)
* [Developer stories](<./CryptPad User Stories/Developer stories/>)
  * [Feature telemetry](<./CryptPad User Stories/Developer stories/Feature telemetry/>)
* [Business stories](<./CryptPad User Stories/Business stories/>)
  * [Legal operation](<./CryptPad User Stories/Business stories/Legal operation/>)
  * [Instance telemetry](<./CryptPad User Stories/Business stories/Instance telemetry/>) -->
