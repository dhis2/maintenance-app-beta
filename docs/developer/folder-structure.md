# Folder structure

## Folders

### `app`

This folder contains everything that's related to the global part of the app,
e.g. the app layout, the navigation or setting up providers

### `components`

This folder contains all components that are shared between multiple pages
and/or the app module

### `utils`

This contains all non-component functionality by features that's shared between
pages and/or the app

### `pages`

Every page has its own folder inside of here, so we can easily colocate
page-specific components and utilities without having to think about their
interfaces as much as if they were in the `components` or `utils` folders.

Example:

```
/pages
  /categories     # The categories list view
    categories.js # The actual component
    index.js      # exports only the view, keeping everything else an internal

  # Just another page
  /categorieOptions
    categorie-options.js
    index.js

  # Exports everything from './categories/index.js' as well as all
  # other page folders
  index.js
```

## References

* Talked about this during a design phase meeting on 2022-12-08. Link to the
  notes
  [here](https://docs.google.com/document/d/1LLeGl85sADqIPGRzOncHD3ffC8KXh1ePmObXAsBYGO4/edit#heading=h.f773ks5f8nmg).
