# Step 1: Plan your deployment

**Goal:** decide how your game servers are managed and what hardware they run on.

**Before you start:** nothing. This is the first step.

You make two decisions here. Both affect every later step, so make them once, now, and the rest of
the track follows from them.

## Decision 1: Choose a hosting model

GameFabric runs game servers in one of two ways.

**Armadas** suit match-based and session-based games. GameFabric keeps a pool of started servers
ready, your matchmaker allocates one when a session begins, and the server shuts down when the
session ends. The number of servers tracks player demand automatically. In the GameFabric UI,
Armadas appear under **Dynamic Fleets**.

**Formations** suit always-on servers that players return to, such as persistent worlds or
server-browser games. A Formation is made up of **Vessels**, each of which is one long-lived game
server with its own name, region and settings. Vessels are created and removed deliberately, not
automatically. In the GameFabric UI, Formations appear under **Persistent Servers**.

Choose Armadas if:

- a matchmaker or backend service decides which players share a server
- sessions are short and servers are interchangeable
- demand varies through the day and you want capacity to follow it

Choose Formations if:

- players choose a specific server, or progression is tied to one
- each server needs its own name, configuration or command-line arguments
- the number of servers changes rarely and deliberately

A game can use both. Many studios run Formations for development and Armadas for live traffic,
or use different models for different game modes.

::: tip Terminology
"Armada" and "Formation" are the API terms used throughout this documentation. The UI groups them
under "Dynamic Fleets" and "Persistent Servers" respectively.
:::

For the trade-offs in full, see [Hosting models](/multiplayer-servers/concepts/hosting-models).

### What this changes later

This track deploys a single **Vessel** in step 6, whichever model you choose. A Vessel is the
fastest way to get one server running and inspect it directly, which is what you want for a first
deployment. If you chose Armadas, step 8 points you at
[ArmadaSets](/multiplayer-servers/deploy/armadasets), which create Armadas across your regions once
the single server works.

## Decision 2: Choose a capacity type

Capacity is the hardware your game servers run on. GameFabric offers three types, and a region can
combine them.

**Bare metal** is dedicated hardware operated by Nitrado. It gives the best price and performance
for steady load, and is the usual choice for baseline capacity.

**GameFabric Cloud** is cloud capacity that Nitrado provisions and manages for you. Use it to
absorb peaks above your bare metal baseline, or to reach places where bare metal is not available.

**Bring your own cloud (BYOC)** connects your own AWS, GCP or Azure account. Use it if you have
committed cloud spend, contractual requirements, or infrastructure that must stay in your account.

Most production setups combine bare metal for baseline capacity with cloud for peaks. GameFabric
fills the higher-priority capacity first, so cloud is only used when bare metal is full.

For the comparison in full, see [Capacity types](/multiplayer-servers/concepts/capacity-types).

### What this changes later

- Bare metal and GameFabric Cloud need no setup from you. Your Nitrado contact provisions the
  locations, and they appear when you create a region in step 5.
- BYOC needs your cloud account connected before step 5. Follow
  [Configuring your cloud provider](/multiplayer-servers/configure/cloud-provider-setup) and allow
  time for it: it involves IAM setup on your side.

## Write down your choices

Keep these two answers to hand. Step 5 asks for the capacity type when you create a region, and
step 8 uses the hosting model to decide what you set up next.

Next: [Get access](/multiplayer-servers/get-started/get-access).
