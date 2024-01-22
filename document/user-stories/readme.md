# YAML user stories

## TODO / Notes 

- working with one JSON global data files is showing limits that may not be owrkable (e.g. not possible to add user stories to the mermaid roadmap on front page)
- trying again to break down the one YAML file into one individual file per story 

with the new `user-stories-source.yml` I am running

```bash
yq -s '.[].title' user-stories-source.yml
```

but so far always getting errors, probably due to YAML syntax subtleties

```
Error: bad file 'user-stories-source.yml': yaml: line 10: did not find expected key
```


## Goal

Noticing that the user stories follow a specific template (namely the… [user
stories](https://en.wikipedia.org/wiki/User_story#Common_templates)), we decided
to have a human editable and readable database of the user stories, to
automatically generate the user story pages and easily manipulate them to add
them to the roadmap for instance.

To achieve this, we compiled the user stories into a `.yaml` document that
contains the user stories, thus separating data from processing them.

## Format

### User stories

Following the user stories format, we noticed that we were mostly following the
who/what/why format:

```
As <who>, I want <what> because <why>.
```

However, there are some variations, such as:

```
As <who>, I want <what> so that <goal>.
```

Or
```
As <who>, I want <what> but I can't because <problem>.
```

Along with a short title for these stories.
Note that there can be more than one story per page, hence the use of a
`stories` field that contains a list of the stories.

Moreover, some precisions are added in the user stories, these can be described
with the `inline` field. It can be an example for instance.

Giving the following structure so far:

```yaml
title: "simple title describing the situation"
stories:
  - who:  "the role of the user"
    what: "what they want to achieve"
    why:  "the reason to achieve it"
    goal: "the endgoal of what they want to achieve"
    inline: "extra information to append"
```

### Extra data

However, a user story page does not simply contains the user stories, but also
extra pieces of information, such as the background behind the user stories, or
what is needed to validate a solution for the scenario.
The former can simply be processed as a list of markdown-formatted elements,
that will be processed and pasted as is in a list, while the latter need a
structure (with `title` and a `done` status to present them as a checklist):

```yaml
extra:
  background:
    - "background info 1"
    - "background info 2"
  acceptance criteria:
    - title: "criteria 1"
      done: yes
    - title: "criteria 2"
      done: no
```

Sometimes issues are linked to explain the background or other related things,
there can also be treated separately with their own syntax 

For that, we compile them into an `extra` field, which can be described as the
following:

```
extra:
  issues:
    - title: "The name of the issue"
      reference: "1234"
```

That can be processed as the following:

```html
<ul>
  <li>
    <a href="https://github.com/cryptpad/cryptpad/issues/{{reference}}">{{title}} #{{reference}}</a>
  </li>
</ul>
```

### Metadata

Besides the data used to generate the page, metadata can be appended to use the
user story in the roadmap (for instance).

These can be: `tags`, `id`, `link-to`, such as in the following example:

```yaml
title: "Ciphersuites"
tags: roadmap
id: ciphersuites
link-to: TweetNaCl
[…]
```



### User story page

Which gives for a page, the following structure:

```yaml
category name:
  title: "simple title describing the situation"
  tags: tag, list
  id: id for the roadmad
  link-to: external links in the roadmap
  stories:
    - who:  "the role of the user"
      what: "what they want to achieve"
      why:  "the reason to achieve it"
      goal: "the endgoal of what they want to achieve"
      inline: "extra information to append"
    - who:  "the role of the user"
      what: "what they want to achieve"
      why:  "the reason to achieve it"
      goal: "the endgoal of what they want to achieve"
  extra:
    background:
      - "background info 1"
      - "background info 2"
    acceptance criteria:
      - title: "criteria 1"
        done: yes
      - title: "criteria 2"
        done: no
    issues:
      - title: "Issues 1234"
        reference: 1234
```


