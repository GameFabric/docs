# Game Server Wrapper

The game server wrapper, also known as the wrapper, gswrapper or gsw, can be used to launch your game server executable
inside the container image that runs your GameFabric Armadas or Vessels.

By starting the executable as a wrapper it can enable various convenience features.

The following features are available:

- [Parameter templating](#command-line-arguments)
- [Configuration file templating](#configuration-files),
- [Shutdown handling](#shutdown-handling),
- [Log tailing](#log-tailing), and
- [Crash reporting](#crash-reporting).

## Pre-requisites

Before using the wrapper, make sure that:

- You have a container image that contains your game server binary
  (see [Building](/multiplayer-servers/getting-started/building-a-container-image) and
  [Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)),
- You have either an Armada or Vessel configured to run the container image
  (see [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server)).

If your game server cannot run in GameFabric because it is missing vital information such as IP address or port numbers,
the wrapper can already help with its templating features.

## Integration

The wrapper is a binary executable file.
It is executed as the main command in the container and in turn executes your game server binary, passing it its command-line arguments.

Here are the steps to do this this:

- [Add the wrapper to your container image](#add-the-gsw-to-your-container-image)
    - Download the binary file
    - Make it executable
    - Build and push the new image
- [Configure GameFabric](#configure-gamefabric)
    - Use the new image
    - Configure the wrapper

### Add the Wrapper to your Container Image

Releases of the wrapper are publicly available at: https://github.com/gamefabric/gswrapper/releases.

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
The wrapper is dependency-free with one exception. It expects an Agones sidecar, which is always present in GameFabric.
If you want to run it locally for development, you need run the Agones SDK server dummy locally
(see [Agones documentation](https://agones.dev/site/docs/guides/client-sdks/local/)).
:::

We use [semantic versioning](https://semver.org/), which indicates that minor and patch updates are safe to use without breaking changes.

Finally, push your new image to the GameFabric image registry, and ensure that the Armada or Vessel uses it.

### Configure GameFabric

Whether you're using an Armada or a Vessel, configuring them to use the wrapper is the same.
Go to Settings > Containers and update the command for your game server container image.

Before:

```shell
/app/gameserver <ARG> [--option]
```

After (with the wrapper):

```shell
/app/gsw [--gsw-option] -- /app/gameserver <ARG> [--option]
```

This executes the wrapper instead of the game server (assuming `gameserver` is the executable of your game server),
but lets the wrapper pass the arguments on to your gameserver binary.

## Features

The wrapper provides a number of convenience features to facilitate the integration with GameFabric, such as [tailing of log files](#log-tailing) or [handling crashes and unclena exits](#crash-reporting).

### Templating

The wrapper collects basic runtime information from Agones, like IP address and ports, and the set of
environment variables for your gameserver.

It is able to pass the collected information as command-line arguments to your gameserver, or to render them into confugration files.

> [!TIP]
> The information collected is also available by directly querying the information via the Agones SDK.

The wrapper uses the standard [Go templating syntax](https://pkg.go.dev/text/template#section-documentation) to configure the command line to run your game server.

#### Command-line Arguments

The available template variables are:

| Placeholder                            | Type                | Description                                                                                                                                                                                                 |
|----------------------------------------|:--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <code v-pre>{{.GameServerIP}}</code>   | `string`            | The IP given by Agones to the game server.                                                                                                                                                                  |
| <code v-pre>{{.GameServerPort}}</code> | `uint16`            | The port given by Agones to the game server. Defaults to the port named `game`, or if there is no port with that name, to the first port found. A different name can be configured using `--ports.primary`. |
| <code v-pre>{{.Ports}}</code>          | `map[string]uint16` | The known game server ports.                                                                                                                                                                                |
| <code v-pre>{{.Env}}</code>            | `map[string]string` | The environment variables.                                                                                                                                                                                  |

**Example:**

```shell
/app/gsw -- /app/gameserver --port={{ .GameServerPort }} --query-port={{ .Ports.query }} --servername={{ .Env.POD_NAME }}
```

#### Configuration Files

The wrapper can be configured to render a templated configuration file before executing the game server.

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
/app/gsw --config.template-path=template.yaml --config.output-path=config.yaml -- /app/gameserver --config=config.yaml
```

### Log Tailing

The wrapper supports tailing log files and printing them to stdout using the wrapper's logger. This can be used to enable log collection for log files, which would otherwise be inaccessible.

In a containerized environment, only logs that are printed to stdout from the first process (PID 1) are collected and are available to be displayed and searched.
Log files, on the other hand, would otherwise be lost as soon as the container of the gameserver is stopped.

| Command-line argument | Environment variable | Description                                                       |
|-----------------------|----------------------|-------------------------------------------------------------------|
| `--tail-log.paths`    | `TAIL_LOG_PATHS`     | Paths from which to tail log files. Can be passed multiple times. |

**Example:**

```shell
/app/gsw --tail-log.paths=gameserver.log --tail-log.paths=error.log -- /app/gameserver
```

### Shutdown Handling

The wrapper can terminate the game server after an elapsed amount of time, by shutting it down a configured duration, depending on its state (`Scheduled`, `Ready`, `Allocated`).

This is useful to force the shutdown of stuck game servers or to allow fleet compaction.

| Command-line argument  | Environment variable | Description                                                                                          |
|------------------------|----------------------|------------------------------------------------------------------------------------------------------|
| `--shutdown.scheduled` | `SHUTDOWN_SCHEDULED` | Shutdown when the game server has been `Scheduled` for the given duration (default: `0s`, disabled). |
| `--shutdown.ready`     | `SHUTDOWN_READY`     | Shutdown when the game server has been `Ready` for the given duration (default: `0s`, disabled).     |
| `--shutdown.allocated` | `SHUTDOWN_ALLOCATED` | Shutdown when the game server has been `Allocated` for the given duration (default: `0s`, disabled). |

**Example:**

```shell
/app/gsw --shutdown.ready=1h --shutdown.allocated=24h -- /app/gameserver
```

### Crash Reporting

Lastly, the crash handler can be configured to run an executable in the event of a server crash. This executable could, for instance, run a debugger on the coredump file to generate a stack trace or to upload the full dump somewhere.
The path to the executable must be specified, and the executable file itself must be present at the path in the image and carry the executable flag.

| Command-line argument               | Environment variable              | Description                                                                                                                        |
|-------------------------------------|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `--crashhandler.exec`               | `CRASHHANDLER_EXEC`               | Path to the crash handler executable.                                                                                              |
| `--crashhandler.args`               | `CRASHHANDLER_ARGS`               | Crash handler arguments. Can be passed multiple times.                                                                             |
| `--crashhandler.max-execution-time` | `CRASHHANDLER_MAX_EXECUTION_TIME` | Timeout after which the crash handler should be aborted (default: `30m`). Please add the time unit, as the default is nanoseconds. |

**Example:**

```shell
/app/gsw --crashhandler.exec=crash.sh --crashhandler.args="{{ .GameServerIP }}" --crashhandler.args="{{ .GameServerPort }}" --crashhandler.max-execution-time=5m
```

## Summary

The wrapper provides a number of convenience features to facilitate the integration with GameFabric.
The offered features could all be implemented in the gameserver itself, however.
Especially using the Agones SDK to implement signaling of state and to obtain runtime information about your running Gameserver instances is recommended.

A more technical but up-to-date documentation about the features can be found here, along with the latest version:
https://github.com/GameFabric/gswrapper.
