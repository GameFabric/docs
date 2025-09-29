# Vessel Shutdown Behavior

To perform maintenance on long-running vessels without interfering with active game servers, the game server should respond to shutdown hints provided via annotations.

## Allocated Vessel

If a vessel shutdown or restart is required, the following two annotations will be added to each affected vessel:

`g8c.io/shutdown-reason` with one of the following reasons:
- `UserInitiated`
- `SpecChange`
- `Maintenance`

and

`g8c.io/shutdown-timestamp` with a timestamp in the format of "2006-01-02T15:04:05Z07:00"


The timestamp will be `now` + the time configured for each reason via: `Settings`->`Advanced`->`Shutdown Notification`

::: info Multiple shutdown reasons
* The annotations are set once and never updated
* they will disappear with the shutdown of the Vessel

So, if there is a `SpecChange` with a higher wait period than a following `UserInitiated` shutdown, GameFabric will still wait the full `SpecChange period` before shutting it down

it can of course being shutdown early by the game server itself responding to the annotations or leaving `Allocated` after all players left
:::


## Non allocated Vessel

Vessel will be shut down immediately, in accordance with the "Termination Grace Period" (under `Settings`->`Advanced`).
