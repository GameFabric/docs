# Dashboards

GameFabric provides predefined Grafana dashboards for monitoring your infrastructure.
You can find these under "Dashboards" in your Grafana instance.

## BBE Probes from Nodes

This dashboard shows BlackBox Exporter (BBE) probe results from each of your assigned nodes to predefined targets, including major cloud providers (AWS, Azure, GCP) and DNS servers (such as Cloudflare at 1.1.1.1 and Google at 8.8.8.8).

This dashboard helps you determine whether game server incidents originate from cloud-provider connectivity issues rather than defects in the application.

### Interpreting the dashboard

Red segments represent periods where a probe failed.

In practice:

- Brief probe failures are common and usually not actionable.
- A sustained failure to a single target may still have no impact -- for example, if the target is a provider your game does not use or a backup DNS endpoint.
- If failures persist across multiple targets, GameFabric automatically marks the service as **Degraded** on [status.gamefabric.com](https://status.gamefabric.com).

:::note Probe results do not always reflect network issues
Probe results are not a definitive measure of network health: a failing probe does not necessarily indicate a network issue, and network issues can occur even when probes succeed. Probes test only specific routes from nodes to a fixed set of predefined targets.

Limitations:

- Only one public, global endpoint is probed per cloud provider; regional routes may behave differently.
- Probes target specific cloud services (such as AWS S3), not the entire cloud platform. Other services on the same provider may be unaffected.
:::
