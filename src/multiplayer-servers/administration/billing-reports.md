---
title: "Billing reports"
description: "The Billing section shows what your GameFabric usage costs, broken down by month."
---

# Billing reports

The Billing section shows what your GameFabric usage costs, broken down by month. Reports are
account-wide: they cover every environment and every region together, so there is no environment
selector on these pages.

Access requires the `invoices` permission in the `billing` API group. See
[Roles and the permission model](/multiplayer-servers/administration/roles).

## Invoices

Each invoice covers one calendar month. Select a year and month to open it.

::: info The current month is an estimate
An invoice for a month that has not finished is marked as estimated. The figure changes as usage
accrues and is not the amount you will be billed.
:::

An invoice is broken into sections, each showing the line items behind the total.

### GameFabric fee

Charged on the CPU cores your game servers consumed, at the tier rate that applies to your
contract. The section shows the tier rate, cores used, cost per core, any discount, and the net
amount.

Cores used is the metric worth watching. It is driven by the CPU **requests** you set on your
Armadas and Vessels, not by what your servers actually consume, so oversized requests cost real
money. See [Resource management](/multiplayer-servers/configure/resource-management) for how to
size them from measured usage.

### SteelShield fee

Charged the same way, on the cores running protected game servers. Present only if SteelShield is
part of your contract.

### Bare metal leases

Charged per leased machine, listed by lease term, location and hardware type. The section shows
quantity, cost per server, sub-total, any discount, and the net amount.

These are committed costs. They do not vary with how much you use the machines, which is exactly
why bare metal is the cheaper option for steady load and the more expensive one for capacity you
rarely use.

### Location fee

Charged per location beyond the number included in your contract. The section lists the included
allowance, the additional locations, the locations themselves, and the cost per location.

Adding a region type that spans many locations can move this figure. Check it after changing your
region layout.

### Cloud fees

Charged on usage of GameFabric Cloud and bring your own cloud capacity, grouped by location.
Expand a location to see its line items.

Cloud fees are the variable part of your bill and the reason
[cloud budgets](/multiplayer-servers/administration/cloud-budget) exist. Bare metal costs the
same whatever happens; cloud costs follow demand.

## Reading a bill you did not expect

Work through the sections in this order.

1. **Cores used going up without more players** — check whether CPU requests were raised on an
   Armada or ArmadaSet, or whether minimum replicas were increased.
2. **Cloud fees going up** — check whether bare metal capacity filled and traffic spilled into
   cloud, and whether scale to zero is active in idle regions.
3. **Location fees appearing** — check whether a region gained locations.
4. **Bare metal changing** — leases changed, which is a contractual change rather than something
   that happens on its own.

## Where to go next

- [Cloud budget](/multiplayer-servers/administration/cloud-budget) — set thresholds and get
  notified before a cloud bill surprises you.
- [Resource management](/multiplayer-servers/configure/resource-management) — the single largest
  lever on the GameFabric fee.
- [Scale to zero](/multiplayer-servers/deploy/scale-to-zero) — release cloud capacity in idle
  regions.
