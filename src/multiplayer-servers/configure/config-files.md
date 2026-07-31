---
title: "Config files"
description: "A config file is a named block of configuration content that GameFabric mounts into your game server containers as a file."
---

# Config files

A config file is a named block of configuration content that GameFabric mounts into your game
server containers as a file. Use it for anything your server reads from disk at startup: a JSON
settings file, a YAML rules file, a map rotation, a server list.

Config files are environment-scoped. The same config file name can hold different content in
`dev` and `prod`, and a game server always gets the version from its own environment.

## When to use a config file

| You have | Use |
|---|---|
| Structured, non-sensitive configuration your server reads from a file | A config file |
| Credentials, tokens, keys, certificates | A [secret](/multiplayer-servers/configure/secrets) |
| A handful of simple values your server reads from the process environment | Environment variables on the Armada or Vessel |

Secrets and config files mount the same way. The difference is what belongs in each: anything that
must not be stored or logged in plain text goes in a secret. Secrets are also capped at 1 MB of
data, where config files have no fixed limit.

## Create a config file

Select **Config Files** in the sidebar, then **Add File**.

| Field | Required | Notes |
|---|---|---|
| Name | Yes | At most 63 characters. Lowercase letters, digits, hyphens and periods, starting and ending with a letter or digit. |
| Description | No | What the file is for. |
| Content | Yes | The file content. You can type it or upload a file. |

The name identifies the config file when you reference it from a game server. It is not the
filename your server sees — that comes from the mount path you set on the Armada, Formation or
Vessel.

## Mount a config file

Mounting happens on the deployment, not on the config file. In the container step of the Armada,
Formation or Vessel wizard, open **Config Files** and add an entry with:

- **Name** — the config file to mount.
- **Mount path** — the absolute path inside the container, including the filename your game server
  expects, such as `/app/config/settings.json`.

The same config file can be mounted into several deployments at different paths.

## Change a config file

Config files are not versioned. Editing one replaces its content, and there is no history to roll
back to. Keep the authoritative copy in your own version control and treat GameFabric as the place
you publish it to.

::: warning Edits propagate to running game servers
Saving a change updates the file in every container that references it, without a redeploy. A game
server that only reads its configuration at startup keeps running with the old values until it
restarts. A game server that re-reads the file picks up the change immediately, possibly
mid-session.

Know which of the two your server does before editing a config file in a live environment.
:::

The UI asks you to confirm before saving, for this reason.

## Delete a config file

Deleting removes the file from all sites it was distributed to. Check nothing references it first:
a deployment that mounts a config file which no longer exists cannot start.

## Where to go next

- [Secrets](/multiplayer-servers/configure/secrets) — for values that must stay confidential.
- [Vessels](/multiplayer-servers/deploy/vessels) — where mounting is configured.
