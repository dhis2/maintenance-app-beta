# Routes for overview, item details & different list-view modes

## Context and Problem Statement

We had some open questions regarding various aspects of the route design,
specifically about how to design overview route paths, whether we need a design
route path and how we want to deal with different list-view modes.

## Decision Outcome

-   Overview routes will have a leading `/overview` path segment, followed by a
    segment with the section's name
-   We don't need item detail routes as these will be shown in a sidebar in the
    list view
-   We have discussed different solutions for list-view modes and haven't come to
    a conclusion yet. As this doesn't impact the rest of the route path design,
    we decided to defer this discussion and include more developers and the UX
    department (so we know what modes we should expect and whether/how they can
    interact with each other)
