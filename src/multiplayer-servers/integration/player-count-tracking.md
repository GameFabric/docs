# Player count and capacity tracking

Game servers created by GameFabric have a counter for players by default which you can use to track player numbers and capacity per game server.

## How to update

Please see the [official Agones SDK documentation](https://agones.dev/site/docs/guides/client-sdks/).

Name of the counter: `players`

Note that a Counter Capacity of `0` means no limits.
When incrementing a counter beyond its capacity, Agones returns an error.

The Agones Counters and Lists API is currently in Beta state.

Example request to set the player count and capacity using the standard linux command line tool `curl`:

```bash
curl -d '{"count": "17", "capacity": "64"}' -H "Content-Type: application/json" -X PATCH http://localhost:${AGONES_SDK_HTTP_PORT}/v1beta1/counters/players
```

## Dashboard

You can find a dashboard which shows the current and historic CCU numbers by opening Grafana via the "Monitoring" menu item
on the left side of your GameFabric instance and navigating to the "Agones" folder which contains the "CCUs" dashboard.
