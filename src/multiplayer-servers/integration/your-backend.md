# Accessing GameFabric programmatically

Beside the UI we offer additional more programmatically ways to work with GameFabric.

All access requires at least one [Service Account](/multiplayer-servers/getting-started/authentication#managing-service-accounts).

## Docker

Game server images are uploaded via `docker` to a [Branch](/multiplayer-servers/getting-started/glossary#branch) of choice.

If you selected `latest (auto update)` in your configuration, pushing a new version of your game server image immediately triggers an automatic rollout.

Please refer to [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server#image) documentation.

## API

GameFabric offers API access to every feature. Please see our dedicated [GameFabric API Guide](/multiplayer-servers/api/guide) for more information.

## Terraform Provider

GameFabric supports Infrastructure as Code (IaC) through the use of Terraform.
The official Terraform Provider plugin is available via Terraform & OpenTofu registries.

* [Terraform provider](https://registry.terraform.io/providers/GameFabric/gamefabric/latest)
* [OpenTofu provider](https://search.opentofu.org/provider/gamefabric/gamefabric/latest)
* [GitHub](https://github.com/GameFabric/terraform-provider-gamefabric/)
