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

The provider block accepts the following arguments:

| Argument | Description |
|----------|-------------|
| `customer_id` | The first segment of your GameFabric installation URL. For example, given the URL `example.gamefabric.dev`, the customer ID is `example`. |
| `service_account` | The email address of the [service account](/multiplayer-servers/authentication/authentication#managing-service-accounts) used for authentication. |

## Authentication

The provider requires a [service account](/multiplayer-servers/authentication/authentication#managing-service-accounts) for authentication. Set the password via environment variable:

```bash
export GAMEFABRIC_PASSWORD='<your-password>'
```

## Resources

For full documentation on available resources and data sources, see the registry documentation:

- [Terraform Registry documentation](https://registry.terraform.io/providers/GameFabric/gamefabric/latest/docs)
- [OpenTofu Registry](https://search.opentofu.org/provider/gamefabric/gamefabric/latest)
- [GitHub repository](https://github.com/GameFabric/terraform-provider-gamefabric/)
