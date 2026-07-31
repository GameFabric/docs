# Roles and the permission model

GameFabric controls access with role-based access control. This page explains the model. For the
click-path to edit a role or a group, see
[Permissions](/multiplayer-servers/administration/permissions).

## How the pieces fit together

```
User ──belongs to──▶ Group ──bound to──▶ Role ──contains──▶ Rules
```

- A **user** is a person who signs in through single sign-on. Users are not granted permissions
  directly.
- A **group** is a collection of users. A user must belong to at least one group, or they get a
  403 when signing in.
- A **role** is a named collection of rules.
- A **rule** is one grant of permission.

[Service accounts](/multiplayer-servers/administration/service-accounts) are non-human identities
and follow the same path: add the service account to a group, and the group's roles apply to it.

## What a rule grants

Every rule combines four required dimensions and two optional ones. A request is allowed if one
rule matches on all of them.

| Field | Meaning |
|---|---|
| `verbs` | The actions allowed, such as `get`, `list`, `create`, `update`, `patch`, `delete`. |
| `apiGroups` | The API group the resource belongs to, such as `armada`, `formation`, `core`, `container`, `billing`, `storage`, `protection`, `rbac`, `authentication`. |
| `resources` | The resources covered, such as `armadas`, `vessels`, `configfiles`, `images`. |
| `environments` | The environments the rule applies in. |
| `scopes` | Optional further restriction. |
| `resourceNames` | Optional restriction to specific named resources. |

`*` is a wildcard in `verbs`, `apiGroups`, `resources` and `environments`.

### Subresources

Some resources have subresources, written `resource/subresource`. These are separate grants, which
is how you allow something narrow without allowing everything.

The most common example is `vessels/log` and `armadas/log`. Granting `get` on those lets someone
read game server logs without being able to see or change the deployments themselves. If a
teammate cannot see logs in the UI, this is the permission they are missing.

Other examples include `secrets/unmasked`, which is what lets a user read a secret's value rather
than just its existence, and `volumesnapshots/restore`.

## How permissions are evaluated

- **Deny by default.** Nothing is allowed unless a rule allows it.
- **Additive.** A user's permissions are the union of every rule in every role bound to every
  group they belong to.
- **No deny rules.** You cannot subtract a permission. To remove access, remove the user from the
  group, or remove the rule from the role.

The practical consequence: a user in a broad group and a narrow group has the broad group's
access. Offboarding means removing someone from all groups, not adding a restriction.

## Environment scoping

Roles themselves are global. The environment restriction lives on each rule, in its
`environments` field. That means one role can grant full control in `dev` and read-only access in
`prod`.

In the role editor, expand a resource to set per-environment permissions. Resources that are not
environment-scoped, such as regions and locations, have no expansion.

## Built-in roles and groups

GameFabric ships with a set of roles prefixed `default:`, each bound to a matching group. These
cannot be edited, which keeps them working across upgrades. To vary from one, create your own
role.

| Group | Role | Grants |
|---|---|---|
| `default:supervisors` | `default:supervisor` | Broad day-to-day access: Armadas, Formations, container images, environments, regions, secrets and config files, plus read access to billing. |
| `default:infrastructure-engineers` | `default:infrastructure-engineer` | Armadas, Formations, container images, protection protocols, storage volumes, audit log exports and cloud budgets. |
| `default:image-providers` | `default:image-provider` | Push and pull container images. This is the group your CI service account needs. |
| `default:auth-providers` | `default:auth-provider` | Manage identity providers, service accounts, groups, roles and role bindings. |
| `default:gameserver-logs` | `default:gameserver-logs` | Read game server logs only. |
| `default:help-center` | `default:help-center` | Access the GameFabric Help Center. |

Administrator groups provisioned for your studio are separate from these and grant full access.

## Create a role

Roles are created and edited under **Access Management > Roles**.

| Field | Required | Notes |
|---|---|---|
| Name | Yes | At most 63 characters. Lowercase letters, digits, hyphens and periods, starting and ending with a letter or digit. |

You then set permissions in a matrix of resources against verbs, expanding a resource to vary the
grant per environment.

Name roles after the job they enable rather than the person doing it, such as `ci-deployer` or
`live-ops`. Roles outlive the people assigned to them.

## Where to go next

- [Permissions](/multiplayer-servers/administration/permissions) — editing groups, users and roles
  in the UI.
- [Service accounts](/multiplayer-servers/administration/service-accounts) — permissions for
  automation.
- [Audit logs](/multiplayer-servers/operate/audit-logs) — what those permissions were used for.
