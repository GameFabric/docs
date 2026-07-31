---
title: "Formations"
description: "A Formation is a template that a group of Vessels inherits from, so you configure one thing instead of one per server."
---

# Formations

A Formation is a template. The Vessels that belong to it inherit its container configuration, so
you change the image once and every server in the group picks it up. Each Vessel still has its own
name, its own region, and its own overrides where it needs to differ.

Use a Formation when you run more than one persistent server. A handful of standalone Vessels works
while you are integrating, but the configuration is repeated in each one, and every image update
becomes a manual edit per server.

::: tip Which model?
Formations are the persistent server model, for worlds and server browsers where players return to
a specific server. If your game is match-based and servers are interchangeable, use
[ArmadaSets](/multiplayer-servers/deploy/armadasets) instead. See
[Hosting models](/multiplayer-servers/concepts/hosting-models).
:::

## Prerequisites

- An image pushed to a branch in the GameFabric Container Registry.
- A region with at least one location.
- Permission to create Formations in the environment.

## Create a Formation

Go to **Persistent Servers > Formations** and select **Add**. The wizard has four steps.

### General

Give the Formation a name and, optionally, a description. The name identifies the Formation and
cannot be changed later.

### Vessels

Define the Vessels that belong to this Formation. For each one, set:

- a **name**, unique within the Formation, at most 24 characters, starting with a lowercase letter
  or digit
- the **region** it runs in
- optionally, **overrides** for that Vessel alone

Vessels are added and removed deliberately. A Formation does not scale itself, which is the point:
each server is a known thing that players return to.

::: warning Name and region are fixed
A Vessel's name and region are part of its identity and cannot be changed after creation. To move a
server to another region, clone the Vessel, select the new region, and delete the original.
:::

### Container Templates & Volumes

This is the shared configuration every Vessel inherits: image, environment variables, ports,
command, resources, sidecars and volumes. See
[Container configuration](/multiplayer-servers/deploy/container-configuration) for every option.

### Advanced & Protection

Health checks, termination grace periods, profiling and SteelShield settings, applied to every
Vessel in the Formation.

## What a Vessel can override

Most configuration is shared, deliberately. A Vessel may override:

- labels
- per-container command and arguments
- per-container environment variables
- per-container config file and secret mounts
- its own termination grace periods

Everything else — the image above all — comes from the Formation. This is what makes a Formation
worth using: one image change rolls out to every server in the group.

Overrides are the right tool for the differences that are genuinely per-server, such as a world
name, a map, or a server-specific display name passed as an argument. If you find yourself
overriding the same value on every Vessel, set it on the Formation instead.

## Suspending a Vessel

Setting a Vessel to suspended stops its game server without deleting the Vessel or its
configuration. The Vessel follows the same graceful shutdown path as a restart and then stays in
`Suspended` until you lift it. See [Vessel states](/multiplayer-servers/deploy/vessel-states).

Suspension is how you take a server offline temporarily, and it is required before restoring a
[volume snapshot](/multiplayer-servers/configure/volumes).

## Moving between standalone Vessels and Formations

Two operations exist for when your setup outgrows its original shape:

- **Convert** turns a standalone Vessel into a Formation, or a Formation back into standalone
  Vessels. Converting a Vessel is the usual path once a successful integration needs to become
  several servers.
- **Extract** pulls a Vessel out of a Formation into a standalone Vessel, for when one server needs
  to diverge further than overrides allow.

Both let you choose what happens to the original afterwards.

## Where to go next

- [Vessels](/multiplayer-servers/deploy/vessels) — creating and inspecting an individual server.
- [Vessel states](/multiplayer-servers/deploy/vessel-states) — what each state means.
- [Container configuration](/multiplayer-servers/deploy/container-configuration) — every shared
  setting.
- [Deploying a new build](/multiplayer-servers/deploy/deploying-a-new-build) — rolling a new image
  out to the Formation.
