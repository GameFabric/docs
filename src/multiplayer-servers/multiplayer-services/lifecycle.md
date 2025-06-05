# Game Server Lifecycle


## Pre-requisites

For best expericene, make sure that:

- Your game server is integrated against the Agones SDK (see [using Agones SDK](/multiplayer-servers/getting-started/using-the-agones-sdk.md)),
- You have a container image that contains your game server binary
  (see [Building](/multiplayer-servers/getting-started/building-a-container-image) and
  [Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)),
- Make sure you chooes the best [hosting model](/multiplayer-servers/hosting-models/identifying-your-hosting-model)
- You have either an Armada or Vessel configured to run the container image
  (see [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server)).

## Best practices

## Health Checks
see [Running your gameserver](/multiplayer-servers/getting-started/running-your-game-server#health-checks)

[agones docs](https://agones.dev/site/docs/guides/health-checking/)

### How to Shutdown your gameserver
The best way to shutdown your gameserver is by calling agones sdk Shutdown() and then wait for the incoming TERM signal before calling your engiens variation of `System.exit(0)`
otherwise the Gameserver will be recreated.

### Agones state cycle
* make sure do either shutdown yor gameserver or call ready again, after the current allocated sessions end (e.g.: last player leaves)


