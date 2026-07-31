# Step 6: Deploy your first game server

**Goal:** run one game server and see it reach the Running state.

**Before you start:** you need the image from step 4 and the environment and region from step 5.

You deploy a single **Vessel**. A Vessel is one long-lived game server with its own name and
configuration, which makes it the clearest thing to inspect and debug first. This is true whichever
hosting model you chose in step 1: if you chose Armadas, step 8 shows how to move from this single
server to fleets that scale with demand.

## Create the Vessel

1. Check that the correct environment is selected in the top bar.
2. Go to **Formations** and select **Add**.
3. Choose **Vessel** as the kind, not Formation.

### General

Give the Vessel a unique name, and optionally a description.

### Region

Select the region you created in step 5.

You do not choose bare metal or cloud here. GameFabric schedules the server using your region type
priorities, and reschedules as capacity changes.

::: warning The region cannot be changed later
A Vessel's region is part of its identity. To move a server to another region, clone the Vessel and
select a different region, then delete the original.
:::

### Volumes

Skip this. Volumes share data between containers in a pod, which a first deployment does not need.

### Containers

This is where most of the configuration lives.

**Image.** Select the image and tag you pushed in step 4.

Leave `autoUpdate` off for now. With it on, every push to that tag's branch immediately rolls out
to this server, which is convenient during development but surprising when you are trying to verify
one specific build.

**Environment variables.** Add any your server needs. Alongside static key/value pairs you can
select the **Pod Field** type to inject platform metadata, such as `metadata.regionName` or
`metadata.imageTag`. Skip this if your server needs nothing.

**Ports.** Add a port for your game traffic, named `game`, with the protocol and container port
your server binds to, such as UDP 7777.

Choose **Dynamic** unless you know you need otherwise. Game servers sit behind network address
translation, so the public port players connect to is not the port your server binds to locally.
With a dynamic port, GameFabric assigns a public port at runtime and your server reads it from the
Agones SDK. Step 7 covers that.

Choose **Passthrough** only if your server requires the public and local port to match, as Steam's
A2S query does. With passthrough, your server must bind to the port the SDK reports rather than a
fixed one.

**Command and arguments.** Leave these empty to use the `CMD` from your Dockerfile.

**Config files and volumes.** Skip both.

**Resources.** Set CPU and memory **requests** to what an average in-use server consumes. Requests
are guaranteed and used for scheduling, so a server is only placed where those resources are
actually free. Limits are optional; a memory limit that catches a leak is worthwhile, CPU limits
usually are not. See
[Resource management](/multiplayer-servers/configure/resource-management) for how to size these.

**Sidecars.** Skip these. You add an allocation sidecar later if you use matchmaking.

### Advanced options

**Enable health checks.** They are off by default to ease first integration, but you did the SDK
work in step 3, so turn them on now and confirm they pass in step 7. Without them, a frozen server
is never detected or replaced, and GameFabric makes no life cycle guarantees for it during
maintenance. The default thresholds are fine.

**Termination grace period.** The default is fine for now. It is the time your server gets to shut
down cleanly after receiving a shutdown hint before it is killed. See
[Terminating game servers](/multiplayer-servers/deploy/terminating-game-servers).

**Profiling** is optional. It costs 2-3% CPU and can stay off for a first deployment.

Select **Create** to finish.

## Watch it start

The Vessel appears in the **Vessels** list. It moves to **RUNNING** once your container starts and
your server calls `agones.Ready()`.

If it does not reach RUNNING, or cycles between states, go to
[Debugging game server integration](/multiplayer-servers/operate/debugging) — step 7 also shows you
where the logs are.

For every configuration option in the wizard, see
[Running your game server](/multiplayer-servers/deploy/vessels).

## What you should have now

A Vessel in the RUNNING state in your environment.

Next: [Connect and verify](/multiplayer-servers/get-started/connect-and-verify).
