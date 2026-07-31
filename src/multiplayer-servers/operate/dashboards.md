---
title: "Dashboards"
description: "The predefined Grafana dashboards GameFabric provides, what each one is for, and how to reach them."
---

# Dashboards

GameFabric provides predefined Grafana dashboards for monitoring your infrastructure. Reach them
through **Monitoring** in the GameFabric UI, then **Dashboards** in Grafana. They are grouped into
folders.

These are the ones the rest of this documentation sends you to.

| Dashboard | Use it to |
|---|---|
| Running Gameservers | See every running game server, and drill into one by selecting its pod name. |
| Gameserver Single Instance | Read the logs of every container in one game server, including sidecars, and view its CPU profile. |
| CCUs | Track concurrent player counts, if your game server reports them. |
| Network health probes | Tell platform connectivity problems apart from faults in your game. |

Your Grafana instance may contain more than these, and you can build your own. See
[Monitoring](/multiplayer-servers/operate/monitoring).

## Running Gameservers

The starting point for anything to do with a specific game server. It lists the game servers
currently running, across Armadas, Formations and Vessels.

Selecting a pod name opens the Gameserver Single Instance dashboard for that server. This is the
route to logs for game servers that are not Vessels, and to logs from a previous run of a container
that has since restarted.

## Gameserver Single Instance

Everything about one game server:

- the logs of every container in the pod, including sidecars, with nothing to select or configure
- CPU profiling data and flame graphs, if [profiling](/multiplayer-servers/operate/profiling) is
  enabled on the deployment

This is the dashboard to use when a game server produces more log volume than the Vessel UI handles
comfortably, and the one to use when debugging the
[allocation flow](/multiplayer-servers/operate/debugging#debugging-the-allocation-flow).

## CCUs

Concurrent player counts. It is populated by the counter your game server
reports through the Agones SDK, so it stays empty until you implement that. See
[Player count tracking](/multiplayer-servers/integrate/player-count-tracking).

## Network health probes (via Blackbox Exporter)

This dashboard shows probe results from each of your assigned nodes to predefined targets, including major cloud providers (Google Cloud (GCP), Azure, and Amazon Web Services (AWS)) and DNS servers (such as Cloudflare at 1.1.1.1 and Google at 8.8.8.8).

This dashboard helps you determine whether game server incidents originate from cloud-provider connectivity issues rather than defects in the application.

### Interpreting the dashboard

Red segments represent periods where a probe failed.

In practice:

- Brief probe failures are common and usually not actionable.
- A sustained failure to a single target may still have no impact. For example, if the target is a provider your game does not use or a backup DNS endpoint.
- If failures persist across multiple targets, GameFabric automatically marks the service as **Degraded** on [status.gamefabric.com](https://status.gamefabric.com).

::: info Probe results do not always reflect network issues
Probe results are not a definitive measure of network health: a failing probe does not necessarily indicate a network issue, and network issues can occur even when probes succeed. Probes test only specific routes from nodes to a fixed set of predefined targets.

Limitations:

- Only one public, global endpoint is probed per cloud provider; regional routes may behave differently.
- Probes target specific cloud services (such as AWS S3), not the entire cloud platform. Other services on the same provider may be unaffected.
:::

## Where to go next

- [Monitoring](/multiplayer-servers/operate/monitoring) — the metrics behind these dashboards, and
  building your own.
- [Debugging game server integration](/multiplayer-servers/operate/debugging) — using these
  dashboards to diagnose a specific problem.
- [Game server logs](/multiplayer-servers/operate/game-server-logs) — reading and downloading logs.
