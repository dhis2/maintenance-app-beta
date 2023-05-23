# Url path structure

We've implemented the following structure:

| URL path                       | Description                            |
| ------------------------------ | -------------------------------------- |
| `/`                            | Redirects to `/overview`               |
| `/overview`                    | Shows tiles for all available sections |
| `/overview/data-elements`      | Section view with tiles                |
| `/data-elements`               | Data elements list view                |
| `/data-elements/:id`           | Data element edit view                 |
| `/data-elements/add`           | Data element create view               |
| `/data-element-groups`         | Data element groups list view          |
| `/data-element-groups/:id`     | Data element group edit view           |
| `/data-element-groups/add`     | Data element group create view         |
| `/data-element-group-sets`     | Data element group sets list view      |
| `/data-element-group-sets/:id` | Data element group set edit view       |
| `/data-element-group-sets/add` | Data element group set create view     |

-   We agreed to omit the `/list` and `/edit` prefixes and go for a more standard
    approach
    -   There won't be a detail view/route, so we don't need these pre- or suffixes
-   Bulk editing will be integrated in the list view, so we won’t need a new
    page/route for this.

## Open question

### How do we deal with different modes in the list view?

The current idea for persisting the bulk edit mode in the url is:

| URL path                                 | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `/data-elements?mode=bulkEdit`           | Data elements list view in bulk edit mode\*           |
| `/data-element-groups?mode=bulkEdit`     | Data element groups list view in bulk edit mode\*     |
| `/data-element-group-sets?mode=bulkEdit` | Data element group sets list view in bulk edit mode\* |

But we also have other modes that we need to think about:

-   batch editing sharing settings
-   displaying an item's details in a sidebar

Since these operations are either performed in a modified version of the
list-view, or in a modal above the list-view, we will not use separate routes,
but query parameters for this.

## References

-   Talked about this during a design phase meeting on 2022-12-08. Link to the
    notes
    [here](https://docs.google.com/document/d/1LLeGl85sADqIPGRzOncHD3ffC8KXh1ePmObXAsBYGO4/edit#heading=h.f773ks5f8nmg).

## Decisions

-   [Routes for overview, item details & different list-view modes](./decisions/0004-overview-detail-and-list-mode-routes.md)
