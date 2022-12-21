# Setting up routes with JSX and no config

## Context and Problem Statement

Routes can be defined either through a config, which is then used to
dynamically create the JSX routes or they can be defined statically with JSX
components

## Considered Options

* Using a configuration to define routes
* Defining routes statically in JSX

## Decision Outcome

Chosen Option: Defining routes statically in JSX, because this makes managing
routes a lot simpler

### Positive Consequences

* It's very easy to understand which routes exist and which component will be
  rendered for a certain route
* Adding "exceptional" behavior to one route can be implemented without
  touching any other route. There's no need to add conditions to some logic
  that translates a routing configuration into JSX components.

### Negative Consequences

* Required authorities for an overview route can't be inferred from child
  routes in a configuration, the required authorities for overview sections
  will have to be duplicated
