# API

Everything you can do in the GameFabric UI you can also do through its REST API. Use it to
automate deployments, drive GameFabric from your backend, or build your own tooling.

Authenticate with an API token generated from a
[service account](/multiplayer-servers/administration/service-accounts). User SSO credentials do
not work against the API.

## Learn the API

- [Guide](/multiplayer-servers/api/guide) — authentication, resource structure, and the conventions
  every endpoint follows.
- [Examples](/multiplayer-servers/api/examples) — worked requests for common tasks.

## Reference

The generated references open in a separate viewer:

- **API Server** — Armadas, ArmadaSets, Formations, Vessels and the rest of the platform resources.
- **Web API** — the endpoints backing the GameFabric UI.
- **Allocation Registry** and **Allocation Allocator** — register game servers and allocate them to
  sessions.
- **Ping Discovery** — discover ping endpoints for latency-based region selection.

Find them in the sidebar under API.

## Where to go next

If you prefer declarative infrastructure over direct API calls, the
[Terraform provider](/multiplayer-servers/integrate/terraform) covers most GameFabric resources.
