## Usage

Enter the subdirectory with all the 11ty config:
```sh
cd .app
```

Install 11ty nd dependencies:
```sh
npm i
```

Run the development server:
```sh
npm run dev
```

Static site builds to the `.app/dist` folder which is ignored by GIT

## Organization

This folder contains the templates and the content to generate the different
pages from the Blueprints summary website.

### Roadmap and index.njk

This file contains the home page of the project with roadmap generation.

The roadmap is generated using the metadata of the different pages. For
instance, the `document/recommendations/contact_verification.md` page contains
the following metadata:

```yaml
tags: roadmap
id: contact-verification
linkto: [reduce-trust, secret-sharing, revocation]
```

- `tags: roadmap` includes the generated page in the `roadmap`’s 11ty
  collection, in practice creating the node in the roadmap.
- `id: contact-verification` specify the `id` of the node, used to link other
  nodes to it.
- `linkto: [reduce-trust, secret-sharing, revocation]` specify the `id`s of the
  nodes which the “contact verification” node links to.

### Security recommendations

In `document/recommendations/`, the pages are simply markdown (`.md`) files,
including the `term` property in their metadata indicating if it is a `short`,
`medium` or `long` term recommendation.

### User stories

As user stories follow the [same
template](https://en.wikipedia.org/wiki/User_story#Common_templates), they are
generated as such in the yaml header of the markdown files.

For instance, in `document/user-stories/delegated-upload-quotas.md`:

```yaml
category: Honest user stories
[…]
goal: people can submit images/files as part of their response
title: Delegated upload quotas
what: add an upload question to my form
who: registered form author
```

Renders as

> As a **registered form author**, I want to **add an upload question to
> my form** so that **people can submit images/files as part of their
> response**. 

The values common to every user story are:
- `category: Honest user stories`: indicates to 11ty that the file is a user
  story.
- `title`: indicates the title of the user story that appears on top of the user
  story page.
- `who`: the kind of user, appears as “As **[who]**,”.
- `what`: what the user wants to do, renders as “I want to **[what]**”.

Then the last part of the sentence is defined by one of these properties:
- `goal`: renders as “so that **[goal]**.”
- `why`: renders as “because **[why]**”.
- `problem`: renders as “but **[problem]**”.
- `solution`: renders as “so I **[solution]**”.

An extra part can be added using the `inline` property to be added as is at the
end of the sentence.

More fields can be added in the `extra` property and only appear in the user
story page (and not the listing).

These are rendered verbatim except for the following formatted sections:
- `issues`: GitHub issues related to the user story, it requires two field to be rendered properly:
  - `reference`: the GitHub reference in the [issue
    list](https://github.com/cryptpad/cryptpad/issues).
  - `title`: the title of the issue that will appear in the link.
- `acceptance criteria`: the acceptance criteria to mark an user story as
  “solved“, it needs the following fields:
  - `title`: the name of the criterion.
  - `done`: a boolean value that indicates if the issue is solved or not
    (ignored for the moment).

### Portable documents

Portable document files can be linked to a page and will appear in the right
panel.

They must appear in the `_assets/` directory at their right location and this
location should be listed in the `pdf` property in the yaml header of the page.

For example, in `document/whitepaper.md`:
```yaml
pdf: /_assets/document/whitepaper/main.pdf
```
