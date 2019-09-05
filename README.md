# Maintenance app (refactor) aka. Mary

This will be the new maintenance app.
It will partially replace the old one section by section.
In order to provide a seamless experience, the two apps will be interlinked,
redirecting to new sections if exists and to old ones if there's no new section yet.

## TODO

Here's a list of what needs to be done in order to start working on the sections:

- [x] Create app shell components
  - [x] Navigation
  - [x] Sidebar
  - [x] Content container
  - [ ] Meaningful `Loading` page component
  - [ ] Meaningful `Error` page component
  - [ ] Meaningful `NoAuthority` page component
- [x] Redirect non-existing pages to the old app
- [x] Setup translation
- [x] Add non-English translations
- [x] Add dynamic overview pages
- [x] Organize which sections are displayed in sidebars and overview pages

## Developing

Simply run:

```
yarn install
yarn start
```
