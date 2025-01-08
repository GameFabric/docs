# Game Server Wrapper

The game server wrapper, also known as the wrapper, gswrapper or gsw, can be used to run your game server executable
inside the container image that runs your GameFabric Armadas or Vessels.

The following features are available:
- [Parameter templating](#command-line-arguments)
- [Configuration file templating](#configuration-files),
- [Shutdown handling](#shutdown-handling),
- [Log tailing](#log-tailing), and
- [Crash reporting](#crash-reporting).

## Pre-requisites

Before using the wrapper, make sure that:

- You have a container image that contains your game server binary
  (see [Building](/multiplayer-servers/getting-started/building-a-container-image) & 
  [Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)),
- You have either an Armada or Vessel configured to run the container image
  (see [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server)).

If your game server cannot run in GameFabric because it is missing vital information such as IP address or port numbers,
the wrapper can already help with its templating features.

## Integration

The wrapper is a binary executable file. 
You have to run the wrapper instead of your game server, and the wrapper runs your game server,
including parameters or options.

Here are the steps to do this this:

- [Add the wrapper to your container image](#add-the-gsw-to-your-container-image)
  - Download the binary file,
  - Make it executable,
  - Build and push the new image.
- [Configure GameFabric](#configure-gamefabric)
  - Use the new image
  - Configure the wrapper

### Add the wrapper to your container image

Releases of the wrapper are publicly available here: https://github.com/gamefabric/gswrapper/releases.

Depending on how you create your container image, the integration for it can be as simple as:
```Dockerfile
ARG version=v2.2.0

ADD https://github.com/GameFabric/gswrapper/releases/download/${version}/gsw_linux_x86_64 \
    /app/gsw
RUN chmod +x /app/gsw
```

This downloads the x86 architecture build for Linux and makes it executable.

We provide builds for common used architectures and operating systems.
Contact us if you need a build that is not available.

::: info
The wrapper is dependency free with one exception. It expects an Agones sidecar, which is always present in GameFabric.
If you want to run it locally for development, you need run the Agones SDK server dummy locally (see [Agones documentation](https://agones.dev/site/docs/guides/client-sdks/local/)).
:::

We also follow [semantic versioning](https://semver.org/), which implies which version you can safely use or upgrade to without breaking changes.

Finally, push your new image back into the GameFabric image registry, and make sure that the Armada or Vessel you're working with
uses the updated image.

### Configure GameFabric

Whether you're using an Armada or a Vessel, configuring them to use the wrapper is the same. 
Go to Settings > Containers and update the new command for your game server container image.

Before:
```shell
/app/gameserver <ARG> [--option]
```

After (with the wrapper):
```shell
/app/gsw -- /app/gameserver <ARG> [--option]
```

This calls the wrapper instead of the game server (assuming `gameserver` this is the executable of your game server),
but instructs the wrapper to call the game server with the arguments or options that your game server requires.

## Features

The wrapper comes with a number of features to minimize your integration efforts with GameFabric or Agones,
and to provide value around your stack, such as [log tailing](#log-tailing) or [crash reports](#crash-reporting).

### Templating

The wrapper consumes basic information from the Agones Sidecar, like IP address or game port, as well as 
environment variables, e.g. set via GameFabric. This can also be implemented by your game server, and we encourage you to
do so, but if you're not there yet, or if your game server relies on having a port passed to it
you can access these variables through the wrapper.

The wrapper uses the standard Go templating syntax and its basic functionality as
described [here](https://pkg.go.dev/text/template#section-documentation).

#### Command-line arguments

The wrapper can be configured to generate a templated command to run the game server.
The available template variables are:

| Placeholder           | Type                | Description                                                                                                                                                                                                 |
|-----------------------|:--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `{{.GameServerIP}}`   | `string`            | The IP given by Agones to the game server.                                                                                                                                                                  |
| `{{.GameServerPort}}` | `uint16`            | The port given by Agones to the game server. Defaults to the port named `game`, or if there is no port with that name, to the first port found. A different name can be configured using `--ports.primary`. |
| `{{.Ports}}`          | `map[string]uint16` | The known game server ports.                                                                                                                                                                                |
| `{{.Env}}`            | `map[string]string` | The environment variables.                                                                                                                                                                                  |

**Example:**

```shell
/app/gsw -- /app/gameserver --port={{ .GameServerPort }} --query-port={{ .Ports.query }} --servername={{ .Env.POD_NAME }}
```

#### Configuration Files

The wrapper can be configured to generate a template configuration file before invoking the game server.
It needs a template file as input, which must be available in the wrapper's container, and an output file path.
The available template variables are the same as for the [command-line arguments](#command-line-arguments).

| Command-line argument    | Environment variable   | Description                                                |
|--------------------------|------------------------|------------------------------------------------------------|
| `--config.template-path` | `CONFIG_TEMPLATE_PATH` | Path at which to write the game server configuration file. |
| `--config.output-path`   | `CONFIG_OUTPUT_PATH`   | Path to the configuration file template.                   |

**Example:**

```yaml
# template.yaml
gameserver:
  ip: "{{ .GameServerIP }}"
  port: "{{ .GameServerPort }}"
  {{- if .Env.POD_NAME }}
  servername: "{{ .Env.POD_NAME }}"
  {{- end }}
```

```shell
gsw --config.template-path=template.yaml --config.output-path=config.yaml -- /app/gameserver --config=config.yaml
```

### Log tailing

The wrapper supports tailing log files and printing them to stdout using the wrapper's logger.

This allows you to see the logs in real time, for example if you're using a Vessel,
and implies that they will be sent to our aggregated log solution.
This can be important because containers, including their log files, are volatile and would otherwise be lost if the container is stopped.

| Command-line argument | Environment variable | Description                                                       |
|-----------------------|----------------------|-------------------------------------------------------------------|
| `--tail-log.paths`    | `TAIL_LOG_PATHS`     | Paths from which to tail log files. Can be passed multiple times. |

**Example:**

```shell
gsw --tail-log.paths=gameserver.log --tail-log.paths=error.log -- /app/gameserver
```

### Shutdown handling

The wrapper can manage the lifetime of the game server by initiating the shutdown for different phases and after a configured
duration.

This can be useful to force the shutdown of stuck game servers or to allow fleet compaction.

| Command-line argument  | Environment variable | Description                                                                                          |
|------------------------|----------------------|------------------------------------------------------------------------------------------------------|
| `--shutdown.scheduled` | `SHUTDOWN_SCHEDULED` | Shutdown when the game server has been `Scheduled` for the given duration (default: `0s`, disabled). |
| `--shutdown.ready`     | `SHUTDOWN_READY`     | Shutdown when the game server has been `Ready` for the given duration (default: `0s`, disabled).     |
| `--shutdown.allocated` | `SHUTDOWN_ALLOCATED` | Shutdown when the game server has been `Allocated` for the given duration (default: `0s`, disabled). |

`Scheduled`, `Ready` and `Allocated` refer to the Agones states explained [here](https://agones.dev/site/docs/reference/gameserver/#gameserver-state-diagram).

**Example:**

```shell
gsw --shutdown.ready=1h --shutdown.allocated=24h -- /app/gameserver
```

### Crash reporting

Lastly, the crash handler can be configured to automatically run an executable in the event of a server crash.
The executable (e.g. a shell script to upload a crash dump) must be provided, executable and be part of the container image.

| Command-line argument               | Environment variable              | Description                                                                                                                        |
|-------------------------------------|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `--crashhandler.exec`               | `CRASHHANDLER_EXEC`               | Path to the crash handler executable.                                                                                              |
| `--crashhandler.args`               | `CRASHHANDLER_ARGS`               | Crash handler arguments. Can be passed multiple times.                                                                             |
| `--crashhandler.max-execution-time` | `CRASHHANDLER_MAX_EXECUTION_TIME` | Timeout after which the crash handler should be aborted (default: `30m`). Please add the time unit, as the default is nanoseconds. |

**Example:**

```shell
gsw --crashhandler.exec=crash.sh --crashhandler.args="{{ .GameServerIP }}" --crashhandler.args="{{ .GameServerPort }}" --crashhandler.max-execution-time=5m
```

## Summary

The wrapper extends the capabilities of your game server to facilitate interaction with Agones and within the Kubernetes infrastructure.
You can choose to use some features while leaving others unused, and you can choose to integrate features into your game server yourself.
Especially when gathering information about Agones, we encourage you to take the first steps as early as possible, as they will be needed later on anyway for an ideal integration.

A more technical but up-to-date documentation about the features can be found here, along with the latest version:
https://github.com/GameFabric/gswrapper.
