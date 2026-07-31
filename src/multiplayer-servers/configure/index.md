# Configure

This section covers the resources your game servers need in place before and around a deployment:
where they run, what they can consume, and what configuration reaches them at runtime.

## The basics every deployment needs

- [Environments and regions](/multiplayer-servers/configure/environments-and-regions) — isolate
  production from development, and group the locations your servers run in.
- [Resource management](/multiplayer-servers/configure/resource-management) — size CPU and memory
  requests and limits so servers are scheduled correctly and cost what you expect.
- [Quotas](/multiplayer-servers/configure/quotas) — the platform limits you work within, including
  the name length rules that surprise people.

## Getting configuration to your servers

- [Secrets](/multiplayer-servers/configure/secrets) — credentials and keys your server needs at
  runtime, kept out of your image.
- [Game server wrapper](/multiplayer-servers/configure/game-server-wrapper) — pass connection
  details to a game server binary you cannot modify.

## Cloud capacity

- [GameFabric Cloud](/multiplayer-servers/configure/gamefabric-cloud) — cloud capacity that Nitrado
  provisions and manages for you.
- [Configuring your cloud provider](/multiplayer-servers/configure/cloud-provider-setup) — connect
  your own AWS, GCP or Azure account for bring your own cloud.

## Where to go next

With configuration in place, [Deploy](/multiplayer-servers/deploy/vessels) runs your servers.
For the reasoning behind regions and capacity, see
[Concepts](/multiplayer-servers/concepts/capacity-types).
