# Game server wrapper

The game server wrapper, also known as the "wrapper", "gswrapper" or "gsw", can be used to launch your game server executable
inside the container image that runs your GameFabric Armadas or Vessels.

The wrapper provides various convenience features over simply launching your game server standalone.

The following features are available:

- [Parameter templating](#command-line-arguments)
- [Configuration file templating](#configuration-files)
- [Shutdown handling](#shutdown-handling)
- [Log tailing](#log-tailing)
- [Post-stop hook](#post-stop-hook)

Additional topics are:

- [Exit codes](#exit-codes)
- [Logging](#logging)

## Pre-requisites

Before using the wrapper, make sure that:

- Your game server is integrated against the Agones SDK (see [Using Agones SDK](../getting-started/using-the-agones-sdk.md)),
- You have a container image that contains your game server binary
  (see [Building a Container Image](/multiplayer-servers/getting-started/building-a-container-image) and
  [Pushing Container Images](/multiplayer-servers/getting-started/pushing-container-images)),
- You have either an Armada or Vessel configured to run the container image
  (see [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server) and
  [Hosting Models](/multiplayer-servers/architecture/identifying-your-hosting-model)).

If your game server cannot run in GameFabric because it is missing vital information such as IP address or port numbers,
the wrapper can already help with its templating features.

## Integration

The wrapper is a binary executable file.
It is executed as the main command in the container.

Before starting your game server, the wrapper collects information from Agones, allowing you to template your game server arguments.
In GameFabric, the Agones SDK server is running in a sidecar container.
For development, you can [run the Agones SDK server locally](https://agones.dev/site/docs/guides/client-sdks/local/).

Here are the steps for the integration:

- [Add the wrapper to your container image](#add-the-wrapper-to-your-container-image)
  - Download the binary file
  - Make it executable
  - Build and push the new image
- [Configure GameFabric](#configure-gamefabric)
  - Use the new image
  - Configure the wrapper

### Add the wrapper to your container image

See the publicly available [gswrapper releases](https://github.com/gamefabric/gswrapper/releases).

Depending on how you create your container image, the integration for it can be as simple as:

```Dockerfile
ARG version=v2.6.0

ADD https://github.com/GameFabric/gswrapper/releases/download/${version}/gsw_linux_x86_64 \
    /app/gsw
RUN chmod +x /app/gsw
```

This downloads the x86 architecture build for Linux and makes it executable.

We provide builds for common used architectures and operating systems.
Contact us if you need a build that is not available.

We use [semantic versioning](https://semver.org/), which indicates that minor and patch updates are safe to use without breaking changes.

Finally, push your new image to the GameFabric image registry, and ensure that the Armada or Vessel uses it.

### Configure GameFabric

Whether you are using an Armada or a Vessel, configuring them to use the wrapper is the same.
Go to "Settings" > "Containers" and update the command and arguments for your game server container image.

Before:

```shell
# Command
/app/gameserver

# Arguments
<ARG> [--option]
```

After (with the wrapper):

```shell
# Command
/app/gsw

# Arguments
[--gsw-option] -- /app/gameserver <ARG> [--option]
```

Notice that the `--` separates the wrapper and its options from the game server and its options.

This executes the wrapper instead of the game server (assuming `gameserver` is the executable of your game server),
but lets the wrapper pass the arguments on to your game server binary.

## Features

The wrapper provides a number of convenience features to facilitate the integration with GameFabric.

### Templating

The wrapper collects basic runtime information from Agones, like IP address and ports, and the set of
environment variables for your game server.

It is able to pass the collected information as command-line arguments to your game server, or to render them into configuration files.

> [!TIP]
> The information collected is also available by directly querying the information via the Agones SDK.

The wrapper uses the standard [Go templating syntax](https://pkg.go.dev/text/template#section-documentation) to configure the command line to run your game
server.

#### Command-line arguments

The available template variables are:

| Placeholder                            | Type                | Description                                                                                                                                                                                                 |
|----------------------------------------|:--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <code v-pre>{{.GameServerIP}}</code>   | `string`            | The IP given by Agones to the game server.                                                                                                                                                                  |
| <code v-pre>{{.GameServerPort}}</code> | `uint16`            | The port given by Agones to the game server. Defaults to the port named `game`, or if there is no port with that name, to the first port found. A different name can be configured using `--ports.primary`. |
| <code v-pre>{{.Ports}}</code>          | `map[string]uint16` | The known game server ports.                                                                                                                                                                                |
| <code v-pre>{{.Env}}</code>            | `map[string]string` | The environment variables.                                                                                                                                                                                  |

**Example:**

```shell
/app/gsw -- /app/gameserver --port="{{ .GameServerPort }}" --query-port="{{ .Ports.query }}" --servername="{{ .Env.POD_NAME }}"
```

#### Configuration files

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

### Log tailing

The wrapper supports tailing log files and printing them to `stdout`. This can be used to enable log collection for log files, which
would otherwise be inaccessible.

In a containerized environment, only logs that are printed to `stdout` from the first process (PID 1) are collected and are available to be displayed and
searched.
Log files, on the other hand, would otherwise be lost as soon as the container of the game server is stopped.

| Command-line argument | Environment variable | Description                                                       |
|-----------------------|----------------------|-------------------------------------------------------------------|
| `--tail-log.paths`    | `TAIL_LOG_PATHS`     | Paths from which to tail log files. Can be passed multiple times. |

**Example:**

```shell
/app/gsw --tail-log.paths=gameserver.log --tail-log.paths=error.log -- /app/gameserver
```

### Shutdown handling

The wrapper can terminate the game server after an elapsed amount of time, by shutting it down after a configured duration, depending on its state (`Scheduled`,
`Ready`, `Allocated`).

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

### Post-stop hook

A post-stop hook allows an executable to run after the game server stops. It can be configured to trigger in both error and non-error scenarios — whether the
server exits due to a failure or shuts down normally.

Once the game server stops, the post-stop hook runs the configured executable. The executable can, for example, analyze a core dump to generate a stack trace or
upload the full dump for further investigation.

The path to the executable must be specified, and the executable file itself must be present at the path in the image and carry the executable flag.

Before invoking the hook, the GSW sets the environment variables `GAMESERVER_EXITCODE` (`int`) and `GAMESERVER_EXITSIGNAL` (`int`) to expose the detected game
server exit code and signal (if applicable).

| Command-line argument                 | Environment variable                | Description                                                                                                                                                                                                                                                                                                                      |
|---------------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--post-stop-hook.path`               | `POST_STOP_HOOK_PATH`               | Path to the executable to be run.                                                                                                                                                                                                                                                                                                |
| `--post-stop-hook.args`               | `POST_STOP_HOOK_ARGS`               | The arguments passed to the executable. Can be used multiple times.                                                                                                                                                                                                                                                              |
| `--post-stop-hook.max-execution-time` | `POST_STOP_HOOK_MAX_EXECUTION_TIME` | Maximum execution time for the post-stop hook (default: `30m`). Warning: When the game server is in the Agones state 'Shutdown', the maximum execution time cannot exceed the termination grace period, which is set to 30s by default. This can be configured on GameFabric > Armadas/Formations > Settings > Advanced section. |
| `--post-stop-hook.on-error`           | `POST_STOP_HOOK_ON_ERROR`           | Determines if the post-stop hook should run when the game server exited with a non-zero exit code. Core dump crashes always cause the post-stop hook to run.                                                                                                                                                                     |
| `--post-stop-hook.on-success`         | `POST_STOP_HOOK_ON_SUCCESS`         | Determines if the post-stop hook should run when the game server exited with exit code 0.                                                                                                                                                                                                                                        |

The output is prefixed with `[gsw] [<file>]`, e.g. `[gsw] [crashdump.sh]`.

Example:

```shell
gsw \
  --post-stop-hook.path=hook.sh \
  --post-stop-hook.args="{{ .GameServerIP }}" \
  --post-stop-hook.args="{{ .GameServerPort }}" \
  --post-stop-hook.max-execution-time=5m \
  --post-stop-hook.on-error=true \
  --post-stop-hook.on-success=false
```

### Other features

| Command-line argument | Environment variable | Description                                                                                                                    |
|-----------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `--local`             | `LOCAL`              | The flag is used to run the GSW locally. It terminates the GSW when Agones transitions into Shutdown, just like in Kubernetes. |

Example:

```shell
gsw --local -- /app/gameserver
```

Use it for local development only.

## Exit codes

The game server wrapper exits with code `0` (success), if:

- The game server exited with code `0`, and
- There either is
  - No post-stop hook set, or
  - No post-stop hook condition applies, or
  - Post-stop hook exited with code `0`.

For any other situation, the exit code is `1` (error).

Examples:

```text
lvl=info msg="Starting game server" svc=gswrapper
lvl=info msg="Game server stopped" svc=gswrapper runtimeSeconds=10.007 exitCode=0 exitSignal=-1

lvl=info msg="Starting post-stop hook" svc=gswrapper
lvl=info msg="Post-stop hook stopped" svc=gswrapper runtimeSeconds=10.042 exitCode=0 exitSignal=-1
```

```text
lvl=info msg="Starting game server" svc=gswrapper
lvl=eror msg="Game server stopped with error" svc=gswrapper runtimeSeconds=10.015 exitCode=1 exitSignal=-1 error="gsemu exited: exit status 1"

lvl=info msg="Starting post-stop hook" svc=gswrapper
lvl=eror msg="Post-stop hook stopped with error" svc=gswrapper runtimeSeconds=3.014 exitCode=-1 exitSignal=-1 error="post-stop hook timed out: context deadline exceeded"
```

## Logging

The GSW uses a structured logger that writes into `stderr`, rather than `stdout` to not interfere with the game server's output.

Available log options:

| Command-line argument | Environment variable | Description                                                                                       |
|-----------------------|----------------------|---------------------------------------------------------------------------------------------------|
| `--log.ctx`           | `LOG_CTX`            | A list of context field appended to every log. Format: `key=value`. Can be passed multiple times. |
| `--log.format`        | `LOG_FORMAT`         | Specify the format of logs. Supported formats: 'logfmt', 'json', 'console'. (default: `logfmt`)   |
| `--log.level`         | `LOG_LEVEL`          | Specify the log level. e.g. `trace`, `debug`, `info`, `error`. (default: `info`)                  |

Produced log output:

| Component          | Output              | Format     | Prefix / Identifier   |
|--------------------|---------------------|------------|-----------------------|
| Game server        | `stdout` (`stderr`) | Unknown    | -                     |
| GSW                | `stderr`            | Structured | `svc=gswrapper`       |
| GSW tail-log       | `stdout`            | Prefixed   | `[gsw] [example.log]` |
| GSW post-stop-hook | `stdout` (`stderr`) | Prefixed   | `[gsw] [hook.sh]`     |

## Summary

The wrapper provides a number of convenience features to facilitate the integration with GameFabric.
The offered features could all be implemented in the game server itself, however.
Especially using the Agones SDK to implement signaling of state and to obtain runtime information about your running game server instances is recommended.

A more technical but up-to-date documentation about the features can be found [in the GitHub repository](https://github.com/GameFabric/gswrapper), along with the latest version.
