# Agones compatibility

GameFabric runs game servers with [Agones](https://agones.dev/site/docs/), and your game server
talks to the platform through an Agones SDK. This page records which Agones version GameFabric
runs and what that means for your integration.

## Supported version

| Component | Version |
|---|---|
| Agones | 1.58.0 |

Your SDK does not have to match this version exactly, but it must be compatible with it. Agones
maintains a
[client SDK compatibility matrix](https://agones.dev/site/docs/guides/client-sdks/) that shows
which SDK releases work with which Agones releases.

::: warning This version changes
GameFabric upgrades Agones periodically. Check this page before assuming a newer SDK feature is
available, and re-check it before a launch. If you depend on behavior that changed between Agones
releases, tell your Nitrado contact so it can be considered before an upgrade.
:::

## Available SDKs

Agones publishes SDKs for several engines and languages, including Unreal Engine, Unity, C++, Go,
Node.js, Rust and C#. See the
[Agones client SDK list](https://agones.dev/site/docs/guides/client-sdks/) for what is current.

If you cannot add an SDK to your game server — an engine without one, or a binary you cannot
rebuild — use the [game server wrapper](/multiplayer-servers/configure/game-server-wrapper)
instead. Your server can also talk to the Agones REST endpoint directly on
`localhost:${AGONES_SDK_HTTP_PORT}`, which Agones sets in your container.

## Engine-specific notes

**Unreal Engine.** The SDK calls `Health()` in the background for you. It also calls `Connect()`
automatically when the SDK initializes, which polls your server and then calls `Ready()` on your
behalf. If you want to control when your server declares itself available, disable that with
`bDisableAutoConnect` and call `Ready()` yourself.

**Unity.** The SDK calls `Health()` in the background for you.

## Testing without GameFabric

Agones ships a local SDK server that answers SDK calls and logs them, so you can develop your
integration without deploying. See the
[Agones local development guide](https://agones.dev/site/docs/guides/client-sdks/local/).

## Where to go next

- [Using the Agones SDK](/multiplayer-servers/integrate/your-game-server) — the calls GameFabric
  relies on.
- [Game server life cycle](/multiplayer-servers/integrate/game-server-lifecycle) — when to make
  each call.
