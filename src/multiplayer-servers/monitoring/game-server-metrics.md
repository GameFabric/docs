# Game server metrics

GameFabric can scrape custom metrics from your game servers. Your game server exposes a Prometheus-style metrics endpoint on a metric port. GameFabric collects the data automatically and makes it available in Grafana and through the [observability tap](/multiplayer-servers/monitoring/obs-tap). Metric ports are available for Armadas, ArmadaSets, Formations, and Vessels.

::: info Not publicly reachable
Metric ports are not exposed to the internet. Only GameFabric can reach them.
:::

## Configuration

Your game server must serve metrics in the [Prometheus text format](https://prometheus.io/docs/instrumenting/exposition_formats/) on the configured port and path. Most [Prometheus client libraries](https://prometheus.io/docs/instrumenting/clientlibs/) provide this endpoint for you.

The metrics endpoint must meet the following requirements:

- The game server listens on the metric port inside the container.
- The game server listens on all network interfaces (`0.0.0.0`), not only on `localhost`.
- The game server answers HTTP `GET` requests on the configured path.

### In the UI

To add a metric port:

1. Open the create flow or the **Settings** tab of an Armada, ArmadaSet, Formation, or Vessel.
2. In the container section, go to **Metric Ports (Optional)**.
3. Select **Add Metric Port**.
4. Fill in the metric port fields:
   - **Name**: A name that is unique within the game server, for example `metrics`.
   - **Port**: The port your game server serves metrics on. Use a port from `1024` to `65535` that is unique within the game server. A common choice is `9090`. For additional metric ports, increment it, for example `9091`.
   - **Path**: The path of the metrics endpoint. The default is `/metrics`. The path must start with `/` and have no commas or whitespace.
5. Save your changes.

### With the API

A metric port is a container port with the policy `None` and the protocol `TCP`. In addition, the template metadata of the resource contains a label that enables scraping and an annotation that lists the endpoints in the format `<port>=<path>`, separated by commas.

The following example configures a metric port `9090` that serves metrics at `/metrics`:

```yaml
spec:
  template:
    metadata:
      labels:
        g8c.io/gameserver-scrape: "true"
      annotations:
        g8c.io/metrics-endpoints: "9090=/metrics"
    spec:
      containers:
        - name: gameserver
          ports:
            - name: metrics
              containerPort: 9090
              policy: None
              protocol: TCP
```

To add another metric port, add a second entry to `ports` with a unique name and port. Then append `<port>=<path>` to the annotation, separated by a comma. For example, the value `"9090=/metrics,9091=/metrics"` configures port `9091` to serve metrics at `/metrics`.

## Scraping and limits

GameFabric scrapes each metrics endpoint every 30 seconds.

::: info Data availability
New metrics can take up to 2 minutes to become available in Grafana and the observability tap. See [Monitoring & Logs](/multiplayer-servers/monitoring/introduction).
:::

The following limits apply per game server:

- **Metric ports**: A maximum of 10 metric ports across all containers.
- **Sample limit**: A maximum of 30 samples per scrape. A sample is a single data point, and a scrape usually returns one sample per series. A series is a unique combination of a metric name and its labels.
- **Series limit**: A maximum of 60 unique series over 24 hours.

::: danger Exceeding the limits
If a game server exceeds the sample limit or the series limit, **GameFabric discards all metrics** of that game server. Other game servers are not affected.

GameFabric scrapes the game server but can't determine which metrics to keep. Keeping only some of them would cause metrics to appear and disappear unpredictably, so GameFabric drops all of them. This keeps the data consistent and makes the problem visible.
:::

::: tip Reducing cardinality
Avoid labels with many distinct values, such as player IDs or IP addresses. Each new label value creates a new series and counts toward the series limit. Histograms also create one series per bucket, plus a `_sum` and a `_count` series, so use few buckets.
:::

## Querying metrics

GameFabric attaches the label `source="gameserver"` to all custom metrics from your game servers. Use it to select these metrics in Grafana or through the [observability tap](/multiplayer-servers/monitoring/obs-tap).

The following query returns all custom metrics from your game servers:

```promql
{source="gameserver"}
```
