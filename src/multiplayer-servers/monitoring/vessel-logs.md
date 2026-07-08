# Downloading Vessel Logs

GameFabric lets you download the game server logs for any Vessel as a compressed archive.
Logs are retrieved from the platform's log aggregation service and delivered as a `.log.gz` file directly to your browser.

Because a Vessel can be restarted over its lifetime, logs are scoped to a specific **instance** identified by a UID.
The download drawer lets you select which instance to download from, including previous ones.

To open the log download drawer, navigate to **Persistent Servers → Vessels**, open the row menu (⋮) for the Vessel you are interested in, and select **Download Logs**.

## Permissions

To download Vessel logs, a user must belong to a `group` with a `role` that has at least `GET` permission for the `vessels/log` resource in the `formation` API group.

::: tip Access Control
For more information on managing permissions, see [Editing Permissions](/multiplayer-servers/getting-started/editing-permissions).
:::

## Form Fields

| Field | Required | Description |
|---|---|---|
| **Vessel Name** | Yes | Pre-filled with the name of the Vessel you selected. |
| **Vessel UID** | Yes | Pre-filled with the UID of the Vessel's currently running instance. Use the dropdown to select a different (e.g. previous) instance. |
| **Time Range** | No | Restricts logs to a specific time window. Supports up to 30 days of history. Leave empty to include all available logs for the selected instance. |
| **Limit Results** | No | Maximum number of log entries to download. Defaults to 100,000. |

## Downloading Logs from a Previous Instance

Each time a Vessel restarts it is assigned a new UID, and logs from the previous run are retained under the old UID.

To download logs from a previous Vessel instance:

1. Open the **Vessel UID** dropdown in the drawer.
2. Select the UID of the instance you want.

The dropdown is populated automatically when the drawer opens. If the list cannot be loaded, the dropdown falls back to the current instance's UID.

## Downloading

Click **Download**. Once the request completes, your browser saves the file as `<vessel-name>.log.gz`.

A success notification confirms the download. If an error occurs — for example because no logs exist for the selected UID and time range — an error notification is shown with the server's message.

## Opening the Log File

The downloaded file is compressed with gzip. To read it:

```bash
gunzip my-vessel.log.gz
# or stream it directly:
zcat my-vessel.log.gz | less
```