# Annotations and labels

Annotations and labels are key-value metadata attached to GameFabric resources. Both appear on
environments, regions, Armadas, ArmadaSets, Formations, Vessels and most other resources.

The difference is what they are for:

- **Labels** categorize. They are used for selecting and filtering resources.
- **Annotations** describe. They carry information for people and for tooling, and are not used
  for selection.

Use a label when something needs to find the resource by that value. Use an annotation for
everything else.

## Add your own annotations

Wherever a resource supports annotations, the UI accepts `key: value` pairs. Both key and value
are required, and pairs are separated with a comma or by pressing Enter.

Useful things to record:

- the team or person responsible for a resource
- a ticket or change reference for why it exists
- the git commit or pipeline run that created it, when deploying from CI

Annotations are the practical way to answer "why does this exist?" months later, especially on
resources created by automation.

## Reserved annotations

GameFabric uses the `g8c.io/` prefix for its own annotations. Treat that prefix as reserved: do
not create your own keys under it, and do not edit the ones GameFabric sets, because some of them
have side effects.

| Key | Set by | Meaning |
|---|---|---|
| `g8c.io/last-editor` | GameFabric | Who last changed the resource. Shown in revision history. |
| `g8c.io/restarted-at` | GameFabric | Timestamp of the last restart request on a Vessel. Changing it restarts the game server. |
| `g8c.io/armada-set-rev` | GameFabric | Which ArmadaSet revision an Armada came from. |
| `g8c.io/continent`, `g8c.io/country`, `g8c.io/city`, `g8c.io/state` | GameFabric | Where a location physically is. |
| `g8c.io/provider-type`, `g8c.io/provider-location` | GameFabric | The capacity provider behind a location and its identifier there. |
| `g8c.io/default-location-type`, `g8c.io/system-location` | GameFabric | Platform-managed location metadata. |

## Annotations on game servers

Annotations also carry per-session data on running game servers, which is a different use from
metadata on your GameFabric resources.

The [allocation sidecar](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers)
writes the matchmaker's allocation payload onto the game server as annotations, and reads
callback annotations back off it. The annotation keys involved are configured with
`ALLOC_PAYLOAD_ANNOTATION` and `ALLOC_CALLBACK_PAYLOAD_ANNOTATION`, and your game server reads
them through the Agones SDK.

[Shutdown hints](/multiplayer-servers/deploy/terminating-game-servers) reach your game server the
same way, on the Agones GameServer object.

Annotation keys are limited to 63 characters, and Kubernetes lowercases the keys the sidecar
writes while preserving the case of values.

## Where to go next

- [Automatically registering game servers](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers)
  — the full reference for allocation payload annotations.
- [Terminating game servers](/multiplayer-servers/deploy/terminating-game-servers) — shutdown
  hints.
