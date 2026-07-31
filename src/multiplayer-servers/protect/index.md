# Protect

Game server ports are exposed to the internet and are a common target for attacks. This section
covers protecting the traffic reaching and leaving your game servers.

Protection is delivered by SteelShield, which inspects packets before they reach your servers.
Availability depends on your installation and on the sites you deploy to.

- [Mitigations](/multiplayer-servers/protect/mitigations) — the filtering rules SteelShield
  applies, and how they relate to protocols and ports.
- [Ports and protocols](/multiplayer-servers/protect/protocols) — apply SteelShield mitigations to
  the ports your game servers expose.
- [Gateway policies](/multiplayer-servers/protect/gateway-policies) — route outgoing game server
  traffic so your own backend is not caught by spoofing attacks.

## Where to go next

For how SteelShield works and how to integrate it into a game client, see the
[SteelShield documentation](/steelshield/gamefabric/introduction). Protection is part of
[Production requirements](/multiplayer-servers/operate/production-requirements), which is worth
reading before launch.
