---
title: "Programmatic access"
description: "The three ways to drive GameFabric from your own tooling — the API, the Terraform provider and the container registry — and which to use for what."
---

# Programmatic access

Everything you can do in the GameFabric UI, you can do from your own tooling. There are three
interfaces, and they are not interchangeable.

| Interface | Use it for | Documentation |
|---|---|---|
| REST API | Anything that happens while your game is running: allocating servers, reading state, reacting to events. | [API guide](/multiplayer-servers/api/guide) |
| Terraform provider | The resources that make up your setup: environments, regions, ArmadaSets, Formations, roles. | [Terraform](/multiplayer-servers/integrate/terraform) |
| Container registry | Shipping builds, from CI. | [Pushing container images](/multiplayer-servers/container-images/pushing-container-images) |

The dividing line is how often a thing changes. Resources that change on a release cadence belong in
Terraform, where the change is reviewable and repeatable. Anything that changes per session belongs
on the API.

## Authentication

All three require a [service account](/multiplayer-servers/administration/service-accounts). Human
SSO credentials do not work for any of them.

A service account has no permissions when created. Grant it only what the pipeline using it needs:

- pushing images requires membership of `default:image-providers`
- API and Terraform access require a role covering the resources and environments in question

See [Roles](/multiplayer-servers/administration/roles).

::: warning Use a separate service account per pipeline
One account per pipeline means you can revoke or rotate one without breaking the others, and the
[audit log](/multiplayer-servers/operate/audit-logs) tells you which pipeline made a change.
:::

API tokens are short-lived. For long-running automation, request a refresh token by including the
`offline_access` scope rather than generating a new token on every run.

## Building from CI

A typical pipeline does three things:

1. Builds the game server image and tags it uniquely, with a commit SHA or a build number. Tags are
   immutable, so a rebuild always needs a new tag.
2. Logs in to the GameFabric Container Registry with the service account, and pushes.
3. Updates the deployment to the new tag, either through the API, through Terraform, or by leaving
   `autoUpdate` enabled on a development environment.

See [Deploying a new build](/multiplayer-servers/deploy/deploying-a-new-build) for what happens to
running game servers when step 3 lands.

## Where to go next

- [API guide](/multiplayer-servers/api/guide) — authentication, resources and examples.
- [Terraform](/multiplayer-servers/integrate/terraform) — installing and configuring the provider.
- [Service accounts](/multiplayer-servers/administration/service-accounts) — creating one and
  generating tokens.
