# Mitigations

A mitigation is the traffic-filtering rule SteelShield applies to a protected port. Each one
understands a particular application protocol and only allows packets that match it, dropping
everything else before it reaches your game server.

Mitigations are provided by the platform operator, not created by studios. You select from the
mitigations available in your installation and expose them to your game servers through a
[protocol](/multiplayer-servers/protect/protocols).

## How mitigations, protocols and ports fit together

```
Mitigation ──referenced by──▶ Protocol ──assigned to──▶ Game server port
(what traffic is valid)      (your named            (the port players
                              application protocol)    connect to)
```

- A **mitigation** defines the filtering action and which network protocols it supports: TCP, UDP,
  or both.
- A **protocol** is the resource you create. It names your game's application protocol and points
  at one mitigation.
- A **port** on an Armada, ArmadaSet, Formation or Vessel selects one protocol. A port with no
  protocol assigned is unprotected, and its traffic is forwarded as-is.

[Gateway policies](/multiplayer-servers/protect/gateway-policies) are separate. They govern
outgoing traffic from your game servers and do not reference mitigations.

## Availability

Mitigations are global, not scoped to an environment or a region. What you see depends on your
installation: if the Protection section does not appear in the UI, no mitigations are provisioned
for you.

Site support is a separate matter. SteelShield is not available on every site, so a fleet spread
across sites can have some game servers protected and some not, under the same revision. Check the
protection state of your sites when planning where to deploy.

## Choosing a mitigation

Pick the mitigation that matches the application protocol your port actually speaks. A mitigation
built for one protocol drops traffic that does not conform to it, so a mismatch looks exactly like
an outage: clients cannot connect and nothing appears in your game server logs.

If you are unsure which mitigation fits your game, ask your Nitrado contact. They know which are
provisioned for your installation and what each one validates.

A mitigation also constrains the network protocols a protocol can allow. You may narrow a protocol
to only TCP or only UDP, but you cannot allow a network protocol the mitigation does not support.

## Where to go next

- [Ports and protocols](/multiplayer-servers/protect/protocols) — create a protocol and assign it
  to your ports.
- [Gateway policies](/multiplayer-servers/protect/gateway-policies) — protect outgoing traffic.
- [SteelShield documentation](/steelshield/gamefabric/introduction) — how the protection works.
