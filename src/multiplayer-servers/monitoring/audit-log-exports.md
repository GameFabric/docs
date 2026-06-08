# Audit log exports

Audit log exports let you continuously push audit logs to an external S3-compatible storage location. This is useful for long-term retention, compliance archiving, or feeding audit data into your own SIEM (Security Information and Event Management) or analytics pipeline.

::: info Delivery delay
To guarantee that all audit log events are captured, GameFabric intentionally delays delivery by a couple of minutes. Events generated close to the current time may not yet appear in the export destination. This applies both to continuous delivery and to the final batch written when an export store is disabled.
:::

::: info Availability
The **Manage Exports** button is only visible to users who have the `GET` permission for the `exportstores` resource in the `audit` API group.
See [Permissions](#permissions) for the full list of required capabilities.
:::

## Permissions

The following permissions are required to manage audit log exports. A user must belong to a `group` with a `role` that includes the relevant permissions.

| Action | Resource | Verb | API group |
|---|---|---|---|
| View exports | `exportstores` | `GET` | `audit` |
| Create exports | `exportstores` | `POST` | `audit` |
| Edit exports | `exportstores` | `PATCH` | `audit` |
| Delete exports | `exportstores` | `DELETE` | `audit` |

See [Editing Permissions](/multiplayer-servers/authentication/editing-permissions) for more information.

## Export stores

An **export store** is the configuration object that targets one S3-compatible bucket. GameFabric continuously delivers batches of audit log events to the configured bucket.

Each export store has a status that reflects its current operational state:

- **Active** — Delivery is running normally.
- **Suspended** — Delivery is paused. GameFabric drains any pending events before transitioning to this state.
- **Error** — Delivery has failed. Hover over the error indicator next to the export store name to see the error message.

## Open the exports drawer

To manage your export stores, navigate to **Audit Logs** and click the **Manage Exports** button in the page header. A summary tag next to the button shows how many exports are active out of the total configured.

## Create an export store

To add a new export destination, follow these steps.

1. Open the **Manage Exports** drawer.
1. Click **Add Export**.
1. Fill in the required fields described in the table below.
1. Click **Add Export** to save.

The following fields are available:

| Field | Required | Description |
|---|---|---|
| **Name** | Yes | A unique identifier for this export store. Must be lowercase alphanumeric, and may contain `-` or `.`. Maximum 63 characters. |
| **Endpoint** | No | The S3-compatible endpoint URL. Defaults to `https://s3.amazonaws.com`. Use a custom value for providers such as Cloudflare R2. |
| **Region** | Yes | The storage region (for example, `eu-west-1`). Use `auto` for providers that do not require a region. |
| **Bucket** | Yes | The name of the S3 bucket to deliver logs into. |
| **Object path / prefix** | No | An optional key prefix (folder) prepended to every uploaded object. |
| **Access Key ID** | Yes | The access key ID for HMAC credential authentication. |
| **Secret Access Key** | Yes | The secret access key for HMAC credential authentication. |

## Edit an export store

To change the configuration of an existing export store, follow these steps.

1. Open the **Manage Exports** drawer.
1. Find the export store you want to change and open its action menu (⋮).
1. Click **Edit**.
1. Update the fields as needed, then click **Save Changes**.

::: info Secret access key
The secret access key is never displayed after creation. To rotate the key, open the edit form and type the new value into the **Secret Access Key** field.
:::

## Enable or disable an export store

Disabling an export store pauses delivery. GameFabric does not transition the status to **Suspended** immediately — it first flushes all pending events to the bucket, including any that fall within the delivery delay window. This drain may take a few minutes. During this time the status remains **Active**; it changes to **Suspended** only after the drain is complete.

To toggle an export store, follow these steps.

1. Open the **Manage Exports** drawer.
1. Open the action menu (⋮) for the export store.
1. Click the **Active / Disabled** toggle to change its state.
1. Confirm the action in the dialog that appears.

## Delete an export store

Deleting an export store permanently removes the configuration. Logs already delivered to the bucket are not affected.

To delete an export store, follow these steps.

1. Open the **Manage Exports** drawer.
1. Open the action menu (⋮) for the export store.
1. Click **Delete** and confirm the action in the dialog.

