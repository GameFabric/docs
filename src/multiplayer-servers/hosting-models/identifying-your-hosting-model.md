# Identifying your Hosting Model

GameFabric supports two major hosting models.

- **Formations** are intended for long-running game servers that have game or player progression associated with them.
  Typically, players are given the ability to return to a specific game server, for example by selecting it from a
  server list. Each game server is usually associated with one or more unique properties, such as the name under
  which they are listed within the server list. Game servers like this are sometimes referred to as **Named Instances**
  or **Persistent Worlds**.
- **Armadas** are the ideal choice for match-based or session-based game servers. For these games, typically a
  matchmaking mechanism decides that a set of players should play together on one server. The matchmaker, or a similar
  service, then _allocates_ a game server for that play session and, once the session is over, the game server shuts
  down. The number of available game servers is dynamically adjusted based on demand.

An individual game does not necessarily have to strictly fall into one of these two categories. Some games require a
different hosting model depending on game mode, or Formations might be chosen over Armadas specifically for development
workflows.

Many aspects remain the same across Armadas and Formations, however they differ in the way that additional game servers
are scaled up when needed, and scaled down again later. Each approach has its own benefits and caveats, which are
outlined in more detail in the following sections.

## Formations

Formations consist of **Vessels**, with each Vessel representing an individual game server that players can connect to.
Vessels share a number of properties with the Formation that they belong to — such as the CPU and RAM resource
requirements and the container image version to be used. However, the Region, environment variables, and command-line
arguments can be overridden on a per-Vessel basis. This allows to, for example, assign a unique server name that the
game server appears under in a server list.

Because each Vessel has these unique properties, they are not automatically scaled up or down. Since player progression
might be tied to an individual Vessel, it is expected that it is always explicitly decided by the game developer if a
new Vessel should be created or an old one deleted.

That also means that Vessels persist through game updates. Even if the underlying game server is being migrated, e.g.
between Bare Metal and Cloud, the Vessel does not need to be recreated.

For development scenarios, it is also possible to create individual Vessels, without an associated Formation, allowing
to customize all aspects of the game server deployment.

Formations and Vessels have the benefit of allowing custom configuration per individual game server. Since Formations
are not scaled up automatically, there is no resource waste, as only the exact number of game servers is being run that
is actually required. However, one caveat is that it might take multiple minutes from Vessel creation to game server
start, especially when scaling to Cloud. Formations are therefore not suited to quickly react to changing player numbers
throughout the day. This is the purpose of Armadas.

## Armadas

Armadas automatically adjust the number of game servers within a given Region based on demand. To always be able to
meet that demand, game servers are started in advance, and once they are ready to accept players, entered into a pool
of available game servers.

Whenever a game server is required for a player, the matchmaker or similar backend service _allocates_ one from this
pool of available game servers, preferring capacity on Bare Metal. The Armada can be configured to always keep a certain
buffer of unallocated game servers available, to be able to keep up with incoming allocation requests.

Any information that is unique to the individual game session, such as the level the game server needs to load, or
the list of players that are about to connect, can be transmitted to the game server via the allocation request. The
connection information for the allocated game server is part of the response to the allocation, and can then be
forwarded to the respective game clients.

After a session has ended, the respective game server shuts down. If the number of unallocated game servers grows beyond
the configured buffer, the number of game servers is automatically reduced again. Only unallocated game serves are
scaled down, to protect ongoing player sessions.

The aforementioned scaling and allocation happens on a per-Region level. However, so-called ArmadaSets can be used to
automatically create Armadas for every Region, reducing management overhead.

Armadas have the benefit of being able to serve hundreds of game server sessions every second, even if the game server
software takes some time to start up. The caveat is that they have to be started in advance, only allowing customization
for the individual game session via the allocation request, not through command-line parameters. To allow this level
of scale, Armadas also only report aggregated information about the game servers within them, which can be inconvenient
for development workflows. In these scenarios, it is recommended to use Formations or even individual Vessels.
