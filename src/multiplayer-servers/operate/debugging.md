---
title: "Debugging game server integration"
description: "Diagnose a game server that will not start, restarts in a loop, cannot be reached by clients, or is never allocated."
---

# Debugging game server integration

Start from the symptom. Each section below covers one thing that commonly goes wrong, in the order
you are likely to hit it, and ends by pointing at the tool that gives you the next piece of
information.

| Symptom | Section |
|---|---|
| The Vessel never reaches `Running` | [A game server that never starts](#a-game-server-that-never-starts) |
| The Vessel cycles between `Starting`, `Terminating` and `Pending` | [A game server that restarts in a loop](#a-game-server-that-restarts-in-a-loop) |
| The Vessel is `Running` but a client cannot connect | [A client that cannot connect](#a-client-that-cannot-connect) |
| Servers are never handed to your matchmaker | [Debugging the allocation flow](#debugging-the-allocation-flow) |

The tools each section refers to — logs, the game server object, environment variables and debug
sidecars — are documented in [Diagnostic tools](#diagnostic-tools).

## A game server that never starts

A Vessel moves through `Pending`, `Scheduled`, `Created` and `Starting` before it reaches
`Running`. Where it stops tells you what went wrong, so read the state and the `status.reason`
next to it on the Vessel details page first. See
[Vessel states](/multiplayer-servers/deploy/vessel-states) for the full reference.

**Stuck in `Pending`, or in `Error` with reason "No suitable site found".** There is no capacity in
the region for this game server. Either no location in the region has room, or your resource
requests are larger than anything available. Lower the CPU and memory requests, add locations to
the region, or ask your Nitrado contact for more capacity. See
[Resource management](/multiplayer-servers/configure/resource-management).

**Stuck in `Created`.** The game server resource exists on the site, but Kubernetes has not placed
its pod on a node. Brief pauses here are normal. If it persists, no node has room for the resources
you requested, so lower the CPU and memory requests or add capacity.

**Reaches `Starting` but produces no container logs at all.** The pod is on a node but your
container never ran, which usually means the image could not be fetched. Check that the image and
tag you selected still exist on the branch, and that the push succeeded. See
[Pushing container images](/multiplayer-servers/container-images/pushing-container-images).

**Reaches `Starting`, then terminates after about ten minutes.** `Starting` means the container is
running but has not signaled ready. After ten minutes GameFabric assumes the site is at fault and
reschedules elsewhere. Almost always this means your game server never called `Ready()`. Read the
container logs to see how far startup got, then confirm the call with the
[game server object](#inspecting-the-game-server-object).

**The container starts and exits immediately.** Read the logs from the previous run, not the
current one — the Vessel UI only shows the current run, so use the Grafana dashboards described in
[Viewing container logs](#viewing-container-logs). The two most common causes are a permissions
error, because the process always runs as uid 1000 regardless of your Dockerfile's `USER`
instruction, and a missing shared library in the image. Run the image locally with
`docker run --user 1000` to reproduce both.

## A game server that restarts in a loop

If a Vessel repeatedly reaches `Running` and then returns to `Pending`, the platform is terminating
it deliberately. Check `status.reason` on the Vessel:

- **No reason, or the server dies shortly after becoming ready.** Your `Health()` calls stopped.
  GameFabric treats a game server that misses its health check deadline as frozen and replaces it.
  Confirm your health loop runs continuously, including while the server is idle and while it is
  loading a map. This is the most common cause of a restart loop.
- **`SpecChange`.** Something is editing the Vessel. If `autoUpdate` is enabled on the container
  image, every push to that branch rolls out immediately. Turn it off while debugging.
- **`Maintenance`.** The site was cordoned. This is expected platform behavior, not a fault in your
  server, and it is why the game server must handle
  [shutdown hints](/multiplayer-servers/deploy/terminating-game-servers).

## A client that cannot connect

If the Vessel is `Running` but traffic does not arrive, work through these in order.

1. **Connect to the public address, not the bind port.** Game servers sit behind network address
   translation, so the public port is not the port your server binds to. Take both the IP and the
   port from the Vessel details page. See
   [Discovering your public address](/multiplayer-servers/integrate/your-game-server#discovering-your-public-address).
2. **Confirm your server binds to `0.0.0.0`.** A server bound to `127.0.0.1` is reachable from
   inside the container and from nowhere else. This is the single most common cause.
3. **Confirm the port definition matches your server.** The protocol and container port configured
   on the Vessel must match what the process actually binds to. A UDP server behind a TCP port
   definition looks exactly like an unreachable server.
4. **If you use passthrough ports, bind to the port the SDK reports.** With passthrough, the
   assigned port is chosen at runtime. A server hardcoded to a fixed port will not receive traffic.
5. **Check the logs for a bind failure.** A server that failed to bind often keeps running, so the
   Vessel still looks healthy.
6. **If SteelShield is active, check the protocol.** A mismatched mitigation drops traffic silently:
   clients cannot connect and nothing appears in your game server logs. See
   [Mitigations](/multiplayer-servers/protect/mitigations).

## Diagnostic tools

### Use Vessels for integration and debugging

Even if your game ultimately requires [Armadas](/multiplayer-servers/get-started/glossary#armada), start with a [Vessel](/multiplayer-servers/get-started/glossary#vessel) during integration and debugging. Vessels give you a single game server that you can restart directly from the UI, and container logs are visible in the UI without any additional setup. This makes the feedback loop much faster than working with Armadas. Once your integration works with a Vessel, test with Armadas as well before deploying to production, since there are differences in configuration that may require adjustments.

### Viewing container logs

Every container in your game server pod writes logs to `stdout` and `stderr`, which GameFabric collects automatically. There are two ways to access them.

::: info File-based logs
Many game engines (for example, Unreal Engine) write logs to files rather than to stdout. These file-based logs are **not** collected automatically and do not appear in the Vessel UI or Grafana. To make them available, you can use the [Game Server Wrapper's log tailing feature](/multiplayer-servers/configure/game-server-wrapper#log-tailing) to forward log files to stdout. Note that [logging quotas](/multiplayer-servers/configure/quotas#logging-limitations) apply.
:::

#### Vessel UI

If you are using a [Vessel](/multiplayer-servers/get-started/glossary#vessel), logs for all containers (including sidecars) are available directly in the Vessel UI. Note that logs from previous container runs are not included — only logs from the current run are shown.

::: warning
The Vessel UI may struggle with game servers that produce high log volumes. For log-heavy servers, use the Grafana dashboards described below.
:::

#### Grafana

All game server logs, including those managed by Formations or Armadas, or those from restarted containers, can be found using the monitoring dashboards:

1. Navigate to **Monitoring** in the GameFabric UI.
1. Open the **Running Gameservers** dashboard.
1. Click any matching pod name. This opens the **Gameserver Single Instance** dashboard.

The **Gameserver Single Instance** dashboard shows all container logs, including all sidecar logs, automatically. There is nothing to select or configure.

### Inspecting the game server object

The Agones SDK exposes a local REST endpoint inside every game server pod. You can query it from within your container (for example, in an entrypoint script or a sidecar) to see the current game server state, addresses, ports, labels, and annotations:

```bash
curl "http://localhost:${AGONES_SDK_HTTP_PORT}/gameserver"
```

To pretty-print the JSON response, pipe to `jq` if available in your image:

```bash
curl "http://localhost:${AGONES_SDK_HTTP_PORT}/gameserver" | jq '.'
```

This endpoint is only accessible from within the pod. The `AGONES_SDK_HTTP_PORT` environment variable is always set in every container in the pod and defaults to `9358`.

This is useful for verifying that your game server transitions through the expected lifecycle states (`Ready`, `Allocated`, `Shutdown`) and that labels and annotations are set correctly.

### Checking environment variables

Misconfigured environment variables are one of the most common issues. To verify that all required variables are set, print them from within your container (for example, in an entrypoint script or a sidecar):

```bash
env
```

::: warning
The `env` command may not be available in minimal or distroless container images. Additionally, `env` prints every environment variable, including secrets such as `ALLOC_TOKEN`. Since the output appears in container logs, avoid running this in production or any environment where logs are shared or retained. If a secret is exposed in logs, rotate it afterward.
:::

### Using a debug sidecar

If you cannot easily add diagnostic commands to your game server, you can run a lightweight sidecar container alongside it. The following example shows one approach that prints environment variables on start and polls the Agones SDK game server object every 10 seconds. This is only an example — you can build your own debug sidecar with different tooling or safer approaches that fit your needs.

::: warning
Because sidecar output appears in container logs, which may include secrets, use debug sidecars only in non-production environments or redact sensitive values before sending logs to shared systems.
:::

#### Building the debug sidecar image

Create the following two files and build the container image.

The shell script (`debugger.sh`):

```bash
#!/usr/bin/env bash

echo "hello from the debugger"
echo
echo "ENV"
env

echo
echo "Agones:"

while true; do
  echo
  curl "http://localhost:${AGONES_SDK_HTTP_PORT}/gameserver" \
    | jq '.'
  sleep 10
done
```

The Dockerfile:

```Dockerfile
# 1. Select an operating system.
FROM ubuntu:24.04

# 2. Pre-install requirements.
RUN apt-get update \
        && apt-get install -y gnupg ca-certificates curl jq \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

# 3. Prepare a working directory and permissions.
RUN mkdir /app && chown 1000:1000 /app

# 4. Copy the debugger entrypoint and make it executable.
USER 1000
COPY --chown=1000:1000 debugger.sh /app/debugger
RUN chmod +x /app/debugger
WORKDIR /app

CMD ["/app/debugger"]
```

Build and push the image to your container registry. If you are building on macOS, specify the target platform explicitly:

```bash
docker build --platform linux/amd64 -t <your-registry>/debug-sidecar:1.0.0 .
docker push <your-registry>/debug-sidecar:1.0.0
```

For more details on building container images, see [Building a container image](/multiplayer-servers/container-images/building-a-container-image#create-a-dockerfile).

#### Adding the debug sidecar to your game server

1. Navigate to your [Formation](/multiplayer-servers/get-started/glossary#formation), [Vessel](/multiplayer-servers/get-started/glossary#vessel), [ArmadaSet](/multiplayer-servers/get-started/glossary#armadaset), or [Armada](/multiplayer-servers/get-started/glossary#armada) detail view.
1. Go to **Settings → Containers** and select **Add Sidecar Container**.
1. Select **Create from scratch**.
1. Set the container image to your debug sidecar image.
1. Save your changes.

For more details on adding custom sidecars, see [Sidecar Containers](/multiplayer-servers/concepts/sidecars#custom-sidecars).

Once deployed, open the **Gameserver Single Instance** dashboard in [Monitoring](/multiplayer-servers/operate/monitoring) and select the debug sidecar container to see the environment variables and game server object output.

## Debugging the allocation flow

If game servers are not being allocated as expected, increase the log verbosity of the [Allocation Sidecar](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers):

1. Set the `LOG_LEVEL` environment variable on the Allocation Sidecar container to `debug`.
1. Check the Allocation Sidecar logs in the **Gameserver Single Instance** dashboard.

At `debug` level, the Allocation Sidecar logs the full allocation payload from your matchmaker. At `info` level (the default), it logs registration events including the game server address, callback address, and configured [attributes](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers#attributes).

For the full list of Allocation Sidecar configuration options, see [Advanced configuration](/multiplayer-servers/integrate/server-allocation/automatically-registering-game-servers#optional-configuration).

## Where to go next

- [Vessel states](/multiplayer-servers/deploy/vessel-states) — what each state and `status.reason`
  means.
- [Game server lifecycle](/multiplayer-servers/integrate/game-server-lifecycle) — the SDK calls the
  platform expects and when to make them.
- [Game server logs](/multiplayer-servers/operate/game-server-logs) — reading logs from a previous
  run, and downloading them.
