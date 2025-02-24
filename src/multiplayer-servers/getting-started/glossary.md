# Glossary

In GameFabric, there are multiple objects you need to be aware of, that are referenced throughout the documentation. Their names and description are detailed in this section.

## ArmadaSet

An ArmadaSet is the configuration for a set of Armadas that share the same Fleet template and automatic scaling strategy.

## Armada

An Armada is a collection of Fleets, distributed across multiple Sites within one Region.
It can have multiple revisions, which are essentially different versions of the same Armada, as it gets updated.
Revisions are kept track of in order to allow you to roll back to a previous revision, as well as manage multiple revisions running in parallel (for example during a rollout upgrade)

## Environment

Environments are a mechanism for isolating groups of resources. Resource names must be unique within each environment, but not across environments.
They can therefore be used to separate production, staging, testing, and any other environments and ensure that they don't interfere.
Alongside the RBAC features, it also allows limiting the access to certain environments from users.

## Fleet

A Fleet is a set of warm GameServers that are available to be allocated from.
It is an Agones object, which you can find [described in more details in their documentation reference](https://agones.dev/site/docs/reference/fleet/).
This resource is always managed by an Armada, and can't be configured through the Armada UI any other way than by configuring the relevant Armada's Fleet Template.

## Region

A Region is typically a geographic area made up of one or more Locations where resources can be hosted.

## Location

A Location is a group of Sites that share a geographical area and other characteristics.
This specific resource is not configurable through the Armada UI. It is configured by Nitrado, for you.

## Site

A Site is a cluster that belongs to a Location.
This specific resource is not configurable through the Armada UI. It is configured by Nitrado, for you.

## Branch

GameFabric runs its own internal Docker registry proxy, which is where you should push your game server images to in order to have them available in Fleets.
Those images are scoped by branch. For example, a standard use case would be to have a development branch and a production branch. The development branch would contain dev images to be used by a development Armada, while the production branch would only contain releases of the game server that make it to production.

## Sidecar

A sidecar is a container that runs alongside your game server container, providing additional functionality.
For example, Nitrado provides an allocator sidecar which can handle the allocation process for you.
You could also run your own sidecars for monitoring or other purposes.

## Wrapper

A wrapper can be used to call your game server binary in order to provide additional functionalities.

We provide a wrapper called [Game Server Wrapper](/multiplayer-services/game-server-wrapper).

You could also write your own wrapper.
