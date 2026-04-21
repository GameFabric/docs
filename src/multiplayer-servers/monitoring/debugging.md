# Debugging game server integration

This guide helps you diagnose common issues with game server integration, such as misconfigured environment variables, unexpected game server state, and allocation problems.

## Use Vessels for integration and debugging

Even if your game ultimately requires [Armadas](/multiplayer-servers/getting-started/glossary#armada), start with a [Vessel](/multiplayer-servers/getting-started/glossary#vessel) during integration and debugging. Vessels give you a single game server that you can restart directly from the UI, and container logs are visible in the UI without any additional setup. This makes the feedback loop much faster than working with Armadas. Once your integration works with a Vessel, test with Armadas as well before deploying to production, since there are differences in configuration that may require adjustments.

## Viewing container logs

Every container in your game server pod writes logs to `stdout` and `stderr`, which GameFabric collects automatically. There are two ways to access them.

### Vessel UI

If you are using a [Vessel](/multiplayer-servers/getting-started/glossary#vessel), logs for all containers (including sidecars) are available directly in the Vessel UI. Note that logs from previous container runs are not included — only logs from the current run are shown.

::: warning
The Vessel UI may struggle with game servers that produce high log volumes. For log-heavy servers, use the Grafana dashboards described below.
:::

### Grafana

All game server logs, including those managed by Formations or Armadas, or those from restarted containers, can be found using the monitoring dashboards:

1. Navigate to **Monitoring** in the GameFabric UI.
1. Open the **Current Gameservers** dashboard.
1. Click any matching pod name. This opens the **Gameserver Single Instance** dashboard.

The **Gameserver Single Instance** dashboard shows all container logs, including all sidecar logs, automatically. There is nothing to select or configure.

## Inspecting the game server object

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

## Checking environment variables

Misconfigured environment variables are one of the most common issues. To verify that all required variables are set, print them from within your container (for example, in an entrypoint script or a sidecar):

```bash
env
```

::: warning
The `env` command may not be available in minimal or distroless container images. Additionally, `env` prints every environment variable, including secrets such as `ALLOC_TOKEN`. Since the output appears in container logs, avoid running this in production or any environment where logs are shared or retained. If a secret is exposed in logs, rotate it afterward.
:::

## Using a debug sidecar

If you cannot easily add diagnostic commands to your game server, you can run a lightweight sidecar container alongside it. The following example shows one approach that prints environment variables on start and polls the Agones SDK game server object every 10 seconds. This is only an example — you can build your own debug sidecar with different tooling or safer approaches that fit your needs.

::: warning
Because sidecar output appears in container logs, which may include secrets, use debug sidecars only in non-production environments or redact sensitive values before sending logs to shared systems.
:::

### Building the debug sidecar image

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

```dockerfile
# 1. Select an operating system.
FROM ubuntu:22.04

# 2. Pre-install requirements.
RUN apt-get update \
        && apt-get install -y gnupg ca-certificates curl jq \
        && apt-get clean -y

# 3. Prepare a working directory and permissions.
RUN mkdir /app
RUN useradd -m -u 1000 debugger
RUN chown debugger:debugger /app

# 4. Copy the debugger entrypoint and make it executable.
USER 1000
COPY --chown=debugger:debugger debugger.sh /app/debugger
RUN chmod +x /app/debugger
WORKDIR /app

CMD ["/app/debugger"]
```

Build and push the image to your container registry. If you are building on macOS, specify the target platform explicitly:

```bash
docker build --platform linux/amd64 -t <your-registry>/debug-sidecar:1.0.0 .
docker push <your-registry>/debug-sidecar:1.0.0
```

For more details on building container images, see [Building a container image](/multiplayer-servers/getting-started/building-a-container-image#create-a-dockerfile).

### Adding the debug sidecar to your game server

1. Navigate to your [Formation](/multiplayer-servers/getting-started/glossary#formation), [Vessel](/multiplayer-servers/getting-started/glossary#vessel), [ArmadaSet](/multiplayer-servers/getting-started/glossary#armadaset), or [Armada](/multiplayer-servers/getting-started/glossary#armada) configuration.
1. In the **Sidecars** section, select **Create from scratch**.
1. Set the container image to your debug sidecar image.
1. Save your changes.

For more details on adding custom sidecars, see [Sidecar Containers](/multiplayer-servers/architecture/sidecars#custom-sidecars).

Once deployed, open the **Gameserver Single Instance** dashboard in [Monitoring](/multiplayer-servers/monitoring/introduction) and select the debug sidecar container to see the environment variables and game server object output.

## Debugging the allocation flow

If game servers are not being allocated as expected, increase the log verbosity of the [Allocation Sidecar](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers):

1. Set the `LOG_LEVEL` environment variable on the Allocation Sidecar container to `debug`.
1. Check the Allocation Sidecar logs in the **Gameserver Single Instance** dashboard.

At `debug` level, the Allocation Sidecar logs the full allocation payload from your matchmaker. At `info` level (the default), it logs registration events including the game server address, callback address, and configured [attributes](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers#attributes).

For the full list of Allocation Sidecar configuration options, see [Advanced configuration](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers#advanced-configuration).
