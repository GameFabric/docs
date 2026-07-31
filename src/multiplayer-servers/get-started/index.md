---
title: "Get started"
description: "This track takes you from an empty GameFabric account to a running game server that a client can connect to. Work through the steps in order."
---

# Get started

This track takes you from an empty GameFabric account to a running game server that a client can
connect to. Work through the steps in order. Each one ends with something you can see in the
GameFabric UI, in your terminal, or from a game client.

The setup you build here is the one you keep. Nothing in this track is a throwaway shortcut that
has to be undone before you go to production.

## What you build

By the end of the track you have:

- a container image of your game server in the GameFabric registry
- an environment and a region with capacity to run it
- a running game server, reachable at a public address
- Agones SDK health, ready and shutdown calls wired up, so the platform can manage the server's
  life cycle correctly

```
Your game server binary
        │
        ▼
  Container image ──push──▶ Branch in the GameFabric registry
                                      │
                                      ▼
                        Environment ──▶ Region ──▶ Running game server
                                                        │
                                                        ▼
                                                   Game clients
```

## Before you start

You need:

- your organization's GameFabric URL, provided during onboarding
- a game server binary compiled for `linux/amd64`
- [Docker](https://docs.docker.com/engine/install/) installed locally
- the ability to change your game server's source code, to add the Agones SDK calls in step 3

## The steps

| Step | What you do |
|---|---|
| [1. Plan your deployment](/multiplayer-servers/get-started/plan-your-deployment) | Choose a hosting model and a capacity type. |
| [2. Get access](/multiplayer-servers/get-started/get-access) | Sign in and create the service account your tooling uses. |
| [3. Prepare your game server](/multiplayer-servers/get-started/prepare-your-game-server) | Integrate the Agones SDK and build a container image. |
| [4. Push your image](/multiplayer-servers/get-started/push-your-image) | Create a branch and push the image to the registry. |
| [5. Set up your environment](/multiplayer-servers/get-started/set-up-your-environment) | Create an environment and a region. |
| [6. Deploy your first game server](/multiplayer-servers/get-started/deploy-your-first-game-server) | Deploy, and watch it start. |
| [7. Connect and verify](/multiplayer-servers/get-started/connect-and-verify) | Find the public address and connect a client. |
| [8. Next steps](/multiplayer-servers/get-started/next-steps) | Choose what to set up next. |

## If you are only evaluating

To see a game server running as quickly as possible, do steps 2, 4, 5 and 6 with a container image
you already have, and skip the Agones SDK work in step 3.

Be aware of what you give up. Without the SDK calls, GameFabric cannot tell whether your server is
healthy or in use, so it may terminate it during scaling or maintenance. That is acceptable for a
short evaluation and not acceptable for anything you run in production. Step 3 explains what to
add before you get there.

## Where to go for depth

This track links out rather than covering everything itself. The other sections hold the detail:

- [Concepts](/multiplayer-servers/concepts/hosting-models) explains how the platform is put together.
- [Container images](/multiplayer-servers/container-images/building-a-container-image),
  [Configure](/multiplayer-servers/configure/regions) and
  [Deploy](/multiplayer-servers/deploy/vessels) are the full references for each step.
- The [glossary](/multiplayer-servers/get-started/glossary) defines every term used in the docs.

Next: [Plan your deployment](/multiplayer-servers/get-started/plan-your-deployment).
