# Url path structure

We've implemented the following structure:

| URL path | Description  |
|-|-|
| `/categories` | List view |
| `/categories?mode=bulkEdit` | List view in bulk edit mode* |
| `/categories/:id` | Edit item view |
| `/categories/add` | Create new item form |

* We agreed to omit the `/list` and `/edit` prefixes and go for a more standard
  approach
* Bulk editing will be integrated in the list view, so we won’t need a new
  page/route for this.

## References

* Talked about this during a design phase meeting on 2022-12-08. Link to the
  notes
  [here](https://docs.google.com/document/d/1LLeGl85sADqIPGRzOncHD3ffC8KXh1ePmObXAsBYGO4/edit#heading=h.f773ks5f8nmg).
