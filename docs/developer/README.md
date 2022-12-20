# Maintenance app (beta)

These docs are about the refactoring of the maintenance app. We're actually not
refactoring any code, we'll rewrite the app section by section.

On Nov 14, 2022 we decided that from the various options, we'll have a
side-by-side app, that's the MVP. We think it'd be nice to have manual
interlinking (the user has to navigate explicitly to the new app; we thought
about having automatic interlinking from the new app to the old one when
clicking on a link to a section that hasn't been implemented yet. This option
has yet to be explored by the entire team).

## Specific topics

* [Folder structure](./folder-structure.md)
* [Url path structure](./url-path-structure.md)
* [Client-side state](./client-side-state.md)
* [Server-side state](./server-side-state.md)

## Decisions

Decisions will be recorded with [ADRs](https://adr.github.io/). A template for
new decisions can be found [here](./templates/ADR.md), which has been copied
from the ["Markdown Any Decision Records"](https://adr.github.io/madr/)'s
repository.

All decisions can be found in the [decisions folder](./decisions).

## General strategy

There are several challenges when it comes to the maintenance app:

* We want to be able to rely as little as possible on config
* We want generic pages/sections to be componsed from the same functionality
* We want the different frontend teams at DHIS2 to be able to work on
  particular sections

We've decided that we'll create a skeleton app with a functional navigation
first. Then we can tackle the first section.

As some of the challenges are new and the app is complex (and a few sections
are complicated as well), we:

* regard everything as an experiment that can be rolled back in case we realize
  that we've taken a wrong direction
* try to adhere to proper composition patterns, so that when a particular
  section / piece of code is somehow different from the rest, we can co-locate
  that difference with that particular section without having to complicate

## Open discussions

We'll use this document for now to document question that have to be answered
and the decision that we'll end up with.

For now we have to answer the following question, not necessarily before
working on the project though but before it's relevant to make a decision:

### state management

#### How do we manage client-side state?

- **open questions**
  - Do we have a per-route state or global, re-usable state?
- **stack options**
  - redux
  - zustand

#### How do we manage form state?

- **stack options**
  - [react-final-form](https://final-form.org/react)
  - [react-hook-form](https://react-hook-form.com/)

#### How do we handle url state?

- **stack options**
  - [react-router](https://reactrouter.com/en/main) +
    [use-query-params](https://github.com/pbeshai/use-query-params)
  - [tanstack-router](https://tanstack.com/router/v1)

### How do we set up **routes**?

- We have a **config** with all routes
  - Makes it easier to infer whether the user has authority to view a certain
    section, as that can depend on whether the user has the auhority to view
    child sections (e.g. is the user allowed to view the "Data Element"
    overview page with links to the list view and the add-new form)
    - Although that'd a be better UX, for now we could sacrifice that
      completeness for simplicity. The user might end up on a page with no
      links (and ideally a message that the user doesn't have the authority to
      view any child sections)
- We declare routes **in JSX**
  - Much better overview, less config, easier to reason about

### Do we want to copy anything from "mar-y"?

A duplicate fo the old code has been put [here](https://github.com/Mohammer5/mar-y).

* [`<RedirectToOld/>`](https://github.com/Mohammer5/mar-y/blob/780633baf1f575abda9adaae4cd8770dec9a772d/src/views/RedirectToOld.js)?
* [`<ProtectedRoute/>`](https://github.com/Mohammer5/mar-y/blob/master/src/modules/Navigation/ProtectedRoute.js)?
