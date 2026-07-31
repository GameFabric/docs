---
title: "Volumes"
description: "Persistent storage for game servers. Volumes, volume stores, snapshots and retention, and how to attach a volume to a game server."
---

# Volumes

::: warning Beta
Persistent storage uses the `storage/v1beta1` API. Behavior may change before it is declared
stable.
:::

A volume is a persistent disk that survives a game server restart. Everything a container writes
outside a volume is lost when the process exits, so anything that must outlive a single server
process — save data, a persistent world, player-built structures — belongs on a volume.

Three resources are involved:

| Resource | Created by | Scope |
|---|---|---|
| Volume store | The platform operator | Global, tied to one region |
| Volume | You | Environment |
| Volume snapshot | You, or automatically on shutdown | Environment, tied to one volume |

A volume store is the backing capacity a volume is carved from. A volume is the disk you attach to
a game server. A snapshot is a point-in-time copy of a volume.

## Create a volume

Select **Volumes** in the sidebar, then add a volume.

| Field | Required | Notes |
|---|---|---|
| Name | Yes | At most 63 characters. Lowercase letters, digits, hyphens and periods, starting and ending with a letter or digit. |
| Volume Store | Yes | Which store to allocate from. This also fixes the volume's region. |
| Capacity | Yes | Accepts `k`, `Ki`, `M`, `Mi`, `G` and `Gi` suffixes. Cannot exceed the store's maximum volume size. |

::: warning A volume cannot move between regions
A volume belongs to the region of its volume store. A game server in another region cannot use it.
To run the same world in a second region, create a second volume there and seed it from a snapshot.
:::

## Volume states

| State | Meaning |
|---|---|
| `Available` | Not attached to anything, ready to be bound. |
| `Bound` | Currently attached to a Vessel. |

A volume attaches to exactly one game server at a time. There is no shared, multi-writer mode.
This is a deliberate constraint: two game servers writing the same world data would corrupt it.

## Attach a volume to a game server

Attaching happens in two places in the deploy wizard.

1. In the **Volumes** step, declare the volume on the Vessel, Formation or Armada.
2. In the **Containers** step, add a volume mount to the container that needs it:

| Field | Required | Notes |
|---|---|---|
| Name | Yes | The declared volume. |
| Mount path | Yes | The absolute path inside the container, such as `/app/data`. |
| Sub path | No | Mount only a specific path within the volume. |
| Read only | No | Mounted read-write unless you set this. |

Remember that your container runs as uid 1000. Your game server must be able to write to the mount
path as that user.

## Resize a volume

You can grow a volume, up to the maximum volume size of its store. You cannot shrink one. The UI
rejects a smaller capacity than the volume currently has.

## Snapshots

A snapshot is a point-in-time copy of a volume. Snapshots come from three places:

- **On exit** — taken automatically when a game server shuts down. These are recorded as offline
  snapshots.
- **On demand** — taken while a game server is running. These are recorded as online snapshots.
- **Uploaded** — a `.tar.gz` or `.tar.zst` archive you upload yourself, up to 4 GB and no larger
  than the volume's capacity. Use this to seed a new volume with existing world data.

### Restore a snapshot

Restoring overwrites the volume's contents.

The Vessel using the volume must be suspended first. A running game server holds the volume open,
and restoring underneath it would corrupt what the server has in memory. Suspend the Vessel,
restore the snapshot, then resume.

### Retention

Retention policies are set per volume store, not per volume, and apply to every volume in the
store. Four values control them:

| Setting | Meaning |
|---|---|
| Online snapshot retention (count) | The minimum number of online snapshots kept. |
| Offline snapshot retention (count) | The minimum number of offline snapshots kept. |
| Online snapshot retention (days) | The minimum age an online snapshot reaches before it can be deleted. |
| Offline snapshot retention (days) | The minimum age an offline snapshot reaches before it can be deleted. |

Count and days both act as floors. A snapshot is only eligible for deletion once it is older than
the retention days *and* removing it would still leave at least the retention count. Set both to
zero only if you do not want snapshots kept at all.

## Where to go next

- [Vessels](/multiplayer-servers/deploy/vessels) — where volumes are attached.
- [Config files](/multiplayer-servers/configure/config-files) — for configuration your server
  reads but does not write.
