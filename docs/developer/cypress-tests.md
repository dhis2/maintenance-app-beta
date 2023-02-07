# Setting up & running cypress tests

## Prerequisites

In order to run cypress tests, a `cypress.env.json` is required in the root
directory. This file is ignored by git on purpose so we don't end up storing
credentials in the public repository.

The file has to look like this:

```json
{
    "dhis2BaseUrl": "https://debug.dhis2.org/dev",
    "dhis2Username": "system",
    "dhis2Password": "System123"
}
```

## Working on cypress tests

The easiest way to work on cypress tests is by starting the app's start script
and the cypress open script independently. There are situations where the
cypress UI has to be restarted and it's more convenient to not have to wait for
the UI as well:

* In one terminal, run `yarn cypress:start`
* In another terminal, run `yarn cypress:open:live`

### Checking whether capturing & stubbing requests work

As this can be a time consuming task, similarly to working on cypress tests,
there are scripts that expect the app to be running already instead of starting
it as well:

* `yarn cypress:run:capture`: Will run the tests and record all network
  requests
* `yarn cypress:run:stub`: Will run the tests and use the recorded requests

## Capturing & replaying network requests

When done working on a branch, you can:

* run `yarn cypress:capture` to generate network fixtures
* run `yarn cypress:stub` to test whether the app works with the generated
  fixtures
