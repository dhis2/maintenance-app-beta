# How do we handle server side state? With app-runtime.

## Context and Problem Statement

Server side state differs from client side state. In the worst case we
duplicate the state on the client, in the best case there's no duplication
whatsoever.

## Considered Options

* tanstack-query + app-runtime
* app-runtime

## Decision Outcome

Chosen option: app-runtime.
Everyone likes tanstack-query + app-runtime, but using tanstack-query directly
in the aggregate data entry app was done as an experiment. We should use
app-runtime and improve it if we find use cases to ensure consistency across
apps.

### Positive Consequences

* We keep apps consistent
* One way of upgrading across apps
