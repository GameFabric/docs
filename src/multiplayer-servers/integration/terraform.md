# Terraform provider

GameFabric supports Infrastructure as Code (IaC) through official Terraform and OpenTofu provider plugins. These allow you to manage GameFabric resources programmatically with version-controlled configurations.

## Installation

To use the provider, add the GameFabric provider to your Terraform configuration:

```hcl
terraform {
  required_providers {
    gamefabric = {
      source  = "GameFabric/gamefabric"
      version = "1.0.0"
    }
  }
}

provider "gamefabric" {
  # Configuration options
}
```

## Authentication

The provider authenticates using environment variables. Set the following to get started:

```bash
export GAMEFABRIC_HOST="example.gamefabric.dev"
export GAMEFABRIC_SERVICE_ACCOUNT="terraform@example.gamefabric.dev"
export GAMEFABRIC_PASSWORD='<your-password>'
```

Replace `example` with your installation name and create a [service account](/multiplayer-servers/authentication/authentication#managing-service-accounts) with appropriate permissions.

## Resources

For full documentation on available resources and data sources, see the registry documentation:

- [Terraform Registry documentation](https://registry.terraform.io/providers/GameFabric/gamefabric/latest/docs)
- [OpenTofu Registry](https://search.opentofu.org/provider/gamefabric/gamefabric/latest)
- [GitHub repository](https://github.com/GameFabric/terraform-provider-gamefabric/)
