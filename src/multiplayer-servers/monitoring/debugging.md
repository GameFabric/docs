# Debugging game server integration

This guide helps you diagnose common issues with game server integration, such as misconfigured environment variables, unexpected game server state, and allocation problems.

## Use Vessels for integration and debugging

Even if your game ultimately requires [Armadas](/multiplayer-servers/getting-started/glossary#armada), use a [Vessel](/multiplayer-servers/getting-started/glossary#vessel) during integration and debugging. Vessels give you a single game server that you can restart directly from the UI, and container logs are visible in the UI without any additional setup. This makes the feedback loop much faster than working with Armadas.

## Viewing container logs

Every container in your game server pod writes logs to `stdout` and `stderr`, which GameFabric collects automatically. There are two ways to access them.

### Vessel UI

If you are using a [Vessel](/multiplayer-servers/getting-started/glossary#vessel), logs for all containers (including sidecars) are available directly in the Vessel UI. This is the fastest way to check what each container sees at runtime.

### Grafana

For running game servers managed by Formations or Armadas, use the monitoring dashboards:

1. Navigate to **Monitoring** in the GameFabric UI.
1. Open the **Current Gameservers** dashboard.
1. Click any matching pod name. This opens the **Gameserver Single Instance** dashboard.

The **Gameserver Single Instance** dashboard shows all container logs, including all sidecar logs, automatically. There is nothing to select or configure.

## Inspecting the game server object

The Agones SDK exposes a local REST endpoint inside every game server pod. You can query it from within the pod to see the current game server state, addresses, ports, labels, and annotations:

```bash
curl "http://localhost:${AGONES_SDK_HTTP_PORT}/gameserver" | jq '.'
```

This endpoint is only accessible from within the pod. The `AGONES_SDK_HTTP_PORT` environment variable is always set in every container in the pod.

This is useful for verifying that your game server transitions through the expected lifecycle states (`Ready`, `Allocated`, `Shutdown`) and that labels and annotations are set correctly.

## Checking environment variables

Misconfigured environment variables are one of the most common issues. Verify that all required variables are set by printing them from within your container:

```bash
env
```

**Warning:** `env` prints every environment variable, including secrets such as `ALLOC_TOKEN`. Avoid running this in production or any environment where container logs are shared or retained unless you redact sensitive values first. If a token is exposed in logs, rotate it afterward.

Pay special attention to variables required by GameFabric services, such as `ALLOC_URL`, `ALLOC_TOKEN`, and `AGONES_SDK_HTTP_PORT`.

## Using a debugger sidecar

If you cannot easily add diagnostic commands to your game server, you can run a lightweight sidecar container that automatically prints environment variables on start and polls the Agones SDK game server object every 10 seconds. Because this output can include secrets, use it only in non-production environments or redact sensitive values before sending logs to shared systems.

### Building the debugger sidecar image

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

# 4. Prepare the debugger script.
USER 1000
COPY --chown=debugger:debugger debugger.sh /app/debugger
RUN chmod +x /app/debugger
WORKDIR /app

CMD ["/app/debugger"]
```

Build and push the image to your container registry:

```bash
docker build -t <your-registry>/debugger-sidecar:1.0.0 .
docker push <your-registry>/debugger-sidecar:1.0.0
```

### Adding the debugger sidecar to your game server

1. Navigate to your [Formation](/multiplayer-servers/getting-started/glossary#formation), [Vessel](/multiplayer-servers/getting-started/glossary#vessel), [ArmadaSet](/multiplayer-servers/getting-started/glossary#armadaset), or [Armada](/multiplayer-servers/getting-started/glossary#armada) configuration.
1. In the **Sidecars** section, select **Create from scratch**.
1. Set the container image to your debugger sidecar image.
1. Save your changes.

For more details on adding custom sidecars, see [Sidecar Containers](/multiplayer-servers/architecture/sidecars#custom-sidecars).

Once deployed, open the **Gameserver Single Instance** dashboard in [Monitoring](/multiplayer-servers/monitoring/introduction) and select the debugger sidecar container to see the environment variables and game server object output.

## Debugging the allocation flow

If game servers are not being allocated as expected, increase the log verbosity of the [Allocation Sidecar](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers):

1. Set the `LOG_LEVEL` environment variable on the Allocation Sidecar container to `debug`.
1. Check the Allocation Sidecar logs in the **Gameserver Single Instance** dashboard.

At `debug` level, the Allocation Sidecar logs the full allocation payload from your matchmaker. At `info` level (the default), it logs registration events including the game server address, callback address, and configured [attributes](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers#attributes).

For the full list of Allocation Sidecar configuration options, see [Advanced configuration](/multiplayer-servers/multiplayer-services/server-allocation/automatically-registering-game-servers#advanced-configuration).
