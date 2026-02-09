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
  customer_id     = "example"
  service_account = "terraform@example.gamefabric.dev"
}
```

The `customer_id` is the first segment of your GameFabric installation URL. For example, given the URL `example.gamefabric.dev`, the customer ID is `example`.

## Authentication

The provider requires a [service account](/multiplayer-servers/authentication/authentication#managing-service-accounts) for authentication. Set the password via environment variable:

```bash
export GAMEFABRIC_PASSWORD='<your-password>'
```

In the configuration example, replace `example` with your actual `customer_id`.

## Resources

For full documentation on available resources and data sources, see the registry documentation:

- [Terraform Registry documentation](https://registry.terraform.io/providers/GameFabric/gamefabric/latest/docs)
- [OpenTofu Registry](https://search.opentofu.org/provider/gamefabric/gamefabric/latest)
- [GitHub repository](https://github.com/GameFabric/terraform-provider-gamefabric/)
