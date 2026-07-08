# Observability tap

The observability tap gives you direct, read-only access to the Prometheus-compatible metrics API and the Loki-compatible logs API for your GameFabric installation. Use it to display data in your own premises with observability tools that support these APIs.

## Requesting access

Access to the observability tap is not enabled by default. To request it, contact your **Customer Success Manager** or raise a request through the **GameFabric Help Center**. Once approved, you receive the credentials needed to authenticate against the endpoints.

## Endpoints

All observability tap endpoints are available under your installation's base URL:

```
https://<your-installation>.gamefabric.dev/observability/
```

Replace `<your-installation>` with your installation name.

The two sub-paths expose the respective APIs:

| API | Base URL |
| --- | -------- |
| Prometheus-compatible metrics | `https://<your-installation>.gamefabric.dev/observability/metrics/` |
| Loki-compatible logs | `https://<your-installation>.gamefabric.dev/observability/logs/` |

## Querying metrics

The metrics endpoint is compatible with the [VictoriaMetrics MetricsQL](https://docs.victoriametrics.com/metricsql/) query language, which is a superset of PromQL. Any tool that supports PromQL also works against this endpoint.

The following Prometheus HTTP API paths are available under the metrics endpoint:

- `/observability/metrics/api/v1/query` — instant query
- `/observability/metrics/api/v1/query_range` — range query
- `/observability/metrics/api/v1/series` — series metadata
- `/observability/metrics/api/v1/labels` — label names
- `/observability/metrics/api/v1/label/<label_name>/values` — label values
- `/observability/metrics/api/v1/metadata` — metric metadata
- `/observability/metrics/api/v1/status/buildinfo` — build information

Refer to the [VictoriaMetrics MetricsQL reference](https://docs.victoriametrics.com/metricsql/) for the full query language documentation.

## Querying logs

The logs endpoint is compatible with the [Loki LogQL](https://grafana.com/docs/loki/latest/query/) query language.

The following Loki HTTP API paths are available under the logs endpoint:

- `/observability/logs/loki/api/v1/query` — instant query
- `/observability/logs/loki/api/v1/query_range` — range query
- `/observability/logs/loki/api/v1/labels` — label names
- `/observability/logs/loki/api/v1/label/<label_name>/values` — label values
- `/observability/logs/loki/api/v1/series` — series metadata
- `/observability/logs/loki/api/v1/index/stats` — index statistics
- `/observability/logs/loki/api/v1/tail` — live tail
- `/observability/logs/loki/api/v1/status/buildinfo` — build information

Refer to the [Loki LogQL reference](https://grafana.com/docs/loki/latest/query/) for the full query language documentation.

## Adding as a Grafana data source

You can add both endpoints as data sources in your own Grafana instance.

### Metrics data source

1. In Grafana, go to **Connections > Data sources** and select **Add new data source**.
2. Choose **Prometheus** as the data source type.
3. Set the **URL** to `https://<your-installation>.gamefabric.dev/observability/metrics/`.
4. Under **Authentication**, set the **Authentication method** to **No authentication**
5. Under **HTTP headers**, click **Add header** and set **Header** to `Authorization` and **Value** to `Bearer <token>`. Replace `<token>` with the token you receive from your Customer Success Manager. Keep the `Bearer` prefix.
6. Select **Save & test** to verify the connection.

### Logs data source

1. In Grafana, go to **Connections > Data sources** and select **Add new data source**.
2. Choose **Loki** as the data source type.
3. Set the **URL** to `https://<your-installation>.gamefabric.dev/observability/logs/`.
4. Under **Authentication**, set the **Authentication method** to **No authentication**
5. Under **HTTP headers**, click **Add header** and set **Header** to `Authorization` and **Value** to `Bearer <token>`. Replace `<token>` with the token you receive from your Customer Success Manager. Keep the `Bearer` prefix.
6. Select **Save & test** to verify the connection.

Once the data sources are configured, you can build dashboards and alerts in your own Grafana instance using the same metrics and logs that power the built-in GameFabric monitoring dashboards.
