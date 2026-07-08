# Downloading Armada Logs

GameFabric lets you download the game server logs from any pod in an Armada as a compressed archive.
Logs are retrieved from the platform's log aggregation service and delivered as a `.log.gz` file directly to your browser.

To open the log download drawer, navigate to **Dynamic Fleets → Armadas**, open the row menu (⋮) for the Armada you are interested in, and select **Download Logs**.

## Permissions

To download Armada logs, a user must belong to a `group` with a `role` that has at least `GET` permission for the `armadas/log` resource in the `armada` API group.

::: tip Access Control
For more information on managing permissions, see [Editing Permissions](/multiplayer-servers/getting-started/editing-permissions).
:::

## Form Fields

| Field | Required | Description |
|---|---|---|
| **Armada Name** | Yes | Pre-filled with the name of the Armada you selected. You can edit it to download logs from a different Armada without reopening the drawer. |
| **Pod Name** | Yes | The name of the game server pod whose logs you want. Must be obtained outside the UI — see [Finding a Pod Name](#finding-a-pod-name) below. |
| **Time Range** | No | Restricts logs to a specific time window. Supports up to 30 days of history. Leave empty to include all available logs. |
| **Limit Results** | No | Maximum number of log entries to download. Defaults to 100,000. |

## Finding a Pod Name

An Armada can run thousands of game server pods simultaneously, and the GameFabric UI does not list individual pod names. You need to obtain the pod name from outside the UI. Common sources include:

- **Your game server process** — Kubernetes injects the pod name into the container as the `POD_NAME` environment variable. Your game server can log or report this value on startup so that your operations team can retrieve it when needed.
- **Your matchmaker or allocation system** — if your matchmaker records which pod handled a session, the pod name will be in those records.
- **The GameFabric API** — you can query game servers via the API and filter by armada to retrieve individual pod names programmatically.

## Downloading

Click **Download**. Once the request completes, your browser saves the file as `<armada-name>.log.gz`.

A success notification confirms the download. If an error occurs — for example because the pod name is not found or the time range contains no data — an error notification is shown with the server's message.

## Opening the Log File

The downloaded file is compressed with gzip. To read it:

```bash
gunzip my-armada.log.gz
# or stream it directly:
zcat my-armada.log.gz | less
```