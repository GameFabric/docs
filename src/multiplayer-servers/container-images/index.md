---
title: "Container images"
description: "GameFabric runs your game server from a container image held in its own registry. This section covers building that image and managing it over time."
---

# Container images

GameFabric runs your game server from a container image held in its own registry. This section
covers building that image and managing it over time.

Images live on **branches**, which are release tracks such as production and development. A game
server always runs a specific image tag from a specific branch, and tags are immutable, so a
deployment always gets exactly the bytes it asked for.

## Getting an image into GameFabric

- [Building a container image](/multiplayer-servers/container-images/building-a-container-image) —
  package your server, including the uid 1000 requirement that catches most first attempts.
- [Pushing container images](/multiplayer-servers/container-images/pushing-container-images) —
  create a branch, authenticate with a service account, tag and push.

## Managing images over time

- [Editing a branch](/multiplayer-servers/container-images/editing-a-branch) — change a branch's
  details and its image retention policy.
- [Deleting container images](/multiplayer-servers/container-images/deleting-container-images) —
  remove images you no longer need.

## Where to go next

Once an image is in the registry, [Deploy](/multiplayer-servers/deploy/vessels) covers running it.
To integrate the Agones SDK into the server inside that image, see
[Integrate](/multiplayer-servers/integrate/your-game-server).
