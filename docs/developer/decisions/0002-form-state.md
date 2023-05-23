# Managing form state with react-form-hook

## Context and Problem Statement

There are various ways how to manage form state so that we have automatic field
validation and error display. We had to pick one of the existing solutions.

## Considered Options

-   React Final Form
-   React Form Hook

## Decision Outcome

Chosen option: React Form Hook, because React Final Form does not seem to be
maintained anymore.

At the same time, it's a "trial period" for react form hook as we don't know
yet whether is provides all the functionality we need. So we keep the option to
use React Final Form in case React Form Hook does not provide what we need.
