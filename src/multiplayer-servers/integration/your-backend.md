# Programmatic Access to GameFabric

In addition to our web-based user interface, GameFabric provides several programmatic methods for interacting with its features.
> **Note:** All programmatic access requires at least one [Service Account](/multiplayer-servers/authentication/authentication#managing-service-accounts).

## Docker Integration

Game server images can be uploaded using `docker` to any [Branch](/multiplayer-servers/getting-started/glossary#branch) of your choice.
If you have selected `autoUpdate` in your configuration, pushing a new version of your game server image will immediately trigger an automatic rollout.

For more details, see the [Running your Game Server](/multiplayer-servers/getting-started/running-your-game-server#image) documentation.

## API Access

GameFabric exposes a comprehensive API for all its features.
Find detailed instructions in our [GameFabric API Guide](/multiplayer-servers/api/guide).

## Terraform Provider Support

GameFabric supports Infrastructure as Code (IaC) through official Terraform and OpenTofu provider plugins:

* [Terraform provider](https://registry.terraform.io/providers/GameFabric/gamefabric/latest)
* [OpenTofu provider](https://search.opentofu.org/provider/gamefabric/gamefabric/latest)
* [GitHub repository](https://github.com/GameFabric/terraform-provider-gamefabric/)
