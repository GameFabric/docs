# Vessel Shutdown Behavior

To perform maintenance on long-running vessels without interfering with active game servers, the game server should respond to shutdown hints provided via annotations.

## Allocated Vessels

If shutdown or restart is required for an already allocated Vessel, the following two annotations will be added to each affected Vessel:

`g8c.io/shutdown-reason` with one of the following reasons:
- `UserInitiated` (e.g. restart/shutdown request via the GameFabric UI)
- `SpecChange`    (e.g. changes to vessel or region configuration)
- `Maintenance`   (e.g. request from SRE to perform maintenance on a node)

and

`g8c.io/shutdown-timestamp` with a timestamp in the format of "2006-01-02T15:04:05Z07:00"


The timestamp will be `now` + the time configured for each reason via: `Settings`->`Advanced`->`Shutdown Notification`

::: info Multiple shutdown reasons
* The annotations are set once and never updated
* They will disappear with the shutdown of the game server

So, if there is a `SpecChange` with a higher wait period than a following `UserInitiated` shutdown, GameFabric will still wait the full `SpecChange period` before shutting it down.

It can of course being shutdown early by the game server itself responding to the annotations or leaving `Allocated` after all players left.
:::


## Non allocated Vessels

Non allocated Vessels will be shut down immediately, in accordance with the `Termination Grace Period` (under `Settings`->`Advanced`).
