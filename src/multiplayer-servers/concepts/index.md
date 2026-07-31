---
title: "Concepts"
description: "This section explains how GameFabric is put together."
---

# Concepts

This section explains how GameFabric is put together. Read it when you want to understand why the
platform behaves the way it does, or before making a decision you cannot easily reverse.

If you just want a game server running, follow the
[get started track](/multiplayer-servers/get-started/) instead and come back here for depth.

The pages are ordered so each one builds on the last. Read them in order the first time.

## What you decide first

- [Hosting models](/multiplayer-servers/concepts/hosting-models) — Armadas for session-based games,
  Formations for persistent servers. This is the first decision you make.
- [Capacity types](/multiplayer-servers/concepts/capacity-types) — bare metal, GameFabric Cloud and
  bring your own cloud, and when each makes sense.

## Where your servers run

- [Regions, sites and locations](/multiplayer-servers/concepts/regions-sites-and-locations) — how
  physical capacity is grouped and presented to you.
- [Scheduling strategy](/multiplayer-servers/concepts/scheduling-strategy) — how GameFabric decides
  which machine a given game server lands on.

## How your servers are managed

- [Armadas and ArmadaSets](/multiplayer-servers/concepts/armadas) — the object model behind
  auto-scaling fleets.
- [Formations and Vessels](/multiplayer-servers/concepts/formations) — the object model behind
  long-lived servers.

## How players reach your servers

- [Matchmaking](/multiplayer-servers/concepts/matchmaking) — where GameFabric fits alongside your
  matchmaker, and why allocation exists at all.
- [Allocators](/multiplayer-servers/concepts/allocators) — the service that assigns a session to a
  specific game server.
- [Ping services](/multiplayer-servers/concepts/ping-services) — how clients measure latency so you
  can route players to the closest region.

## What runs beside your server

- [Sidecar containers](/multiplayer-servers/concepts/sidecars) — extra containers that share a pod
  with your game server, used for allocation, logging and debugging.

## Describing your resources

- [Annotations and labels](/multiplayer-servers/concepts/annotations) — metadata on GameFabric
  resources, and the reserved keys GameFabric sets itself.

## Where to go next

The [glossary](/multiplayer-servers/get-started/glossary) defines every term used across these
docs. For the practical steps that use these concepts, see
[Configure](/multiplayer-servers/configure/regions) and
[Deploy](/multiplayer-servers/deploy/vessels).
