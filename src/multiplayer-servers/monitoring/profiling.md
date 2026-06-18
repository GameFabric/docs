# Profiling

GameFabric Multiplayer Servers has built-in support for eBPF-based CPU performance profiling using [Grafana Pyroscope](https://grafana.com/oss/pyroscope/).

## Overview

Continuous profiling helps you understand CPU usage patterns of your game servers in production. The data is visualized as flame graphs in your Grafana instance, making it easy to identify performance bottlenecks.

This feature has an expected CPU performance impact of just 2-3%, so in most cases it is safe to enable.

## Enabling Profiling

Profiling can be enabled when creating or editing a Vessel or Armada. Navigate to **Advanced Options > Profiling** and toggle the setting.

::: info Data Collection
Profiling data is only collected while the feature is enabled. You cannot retroactively view profiling data for periods when it was disabled.
:::

## Viewing Profiling Data

Profiling data is visualized in your Grafana instance. There are two ways to access it:

1. **Current Gameservers dashboard** - Click on any game server (pod) name to drill down into its profiling data.

2. **Gameserver Single Instance dashboard** - Navigate to this dashboard and select your game server to view its flame graph and CPU profiling data.

Both dashboards are linked on the Grafana home page under **Featured Dashboards**.

::: tip Quick Access
From the GameFabric UI, click **Monitoring** in the sidebar to open your Grafana instance.
:::

## Troubleshooting Unknown Symbols

For profiling data to be useful, your game server binary needs to expose debug symbols. If you see `[unknown]` in your flame graphs instead of meaningful function names, your binary may not have the necessary symbol information.

Symbol resolution depends on your build configuration. Ensure your game server binary is not stripped and includes debug symbols.

If symbols are not resolving correctly, see [Troubleshoot unknown symbols](https://grafana.com/docs/alloy/latest/reference/components/pyroscope/pyroscope.ebpf/#troubleshoot-unknown-symbols) in the Grafana Alloy documentation.
