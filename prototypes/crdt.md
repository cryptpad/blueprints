---
title: Offline-First Editing with CRDTs
author: Theo von Arx
date: 2023-03-14
tags: roadmap
id: crdt
linkto: [prevent-replay]
demo: https://yjs.blueprints.cryptpad.org/
git: https://github.com/cryptpad/blueprints/tree/main/prototypes/yjs
---
_Some code from <https://github.com/yjs/yjs-demos/tree/main/codemirror>_

---

# CodeMirror Demo
Yjs and Codemirror demos: [y-codemirror](https://docs.yjs.dev/ecosystem/editor-bindings/codemirror) / [y-websocket](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket) / [Live Demo](https://demos.yjs.dev/codemirror/codemirror.html)

This is a demo of a [CodeMirror 5](https://codemirror.net/5) editor that was made collaborative with Yjs & y-codemirror. Note that CodeMirror 6 is now the latest release.

We use the [y-websocket](https://docs.yjs.dev/ecosystem/connection-provider) provider to share document updates through a server. There are many more providers available for Yjs - try switching to another provider. [See docs](https://docs.yjs.dev/ecosystem/connection-provider).

Future work: [adding offline persistence](https://docs.yjs.dev/getting-started/allowing-offline-editing) to this demo. Wouldn't it be cool if document updates are persisted in the browser, so you can load your application faster?

## Quick Start


```sh
npm i
npm start
# Project is running at http://localhost:8080/
```
