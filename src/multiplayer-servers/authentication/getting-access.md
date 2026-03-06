# Getting Access

## Overview

GameFabric uses SSO (Single Sign-On) for user authentication and RBAC (Role-Based Access Control) for permissions.

- Google SSO is enabled by default
- An administrator must add users to a group before they can sign in
- Access permissions are determined by group membership

## For users

### Prerequisites

Before you can sign in to GameFabric:

- You need your organization's GameFabric URL (provided during onboarding)
- An administrator must add your email to at least one group

### Signing in with Google

1. Navigate to your organization's GameFabric URL
2. Click **Log in with Google**
3. Sign in with your Google account

::: warning 403 Forbidden error
If you see a 403 Forbidden error after signing in, your account has not been added to any group. Contact your administrator to request access.
:::

### Email login

The **Log in with Email** option is not recommended for regular users, but rather for temporary access or verifying service account access. See [Service Accounts](/multiplayer-servers/authentication/service-accounts) for more information.

### Custom SSO providers

If your organization uses a different identity provider (Microsoft ENTRA, Okta, Auth0, etc.), your administrator may have configured a custom SSO option. The login page displays additional sign-in buttons for any configured providers.

For information on configuring custom SSO providers, see [Setup Third-Party OAuth Integration](/multiplayer-servers/authentication/setup-third-party-oauth).

## For administrators

### Adding a new user

Users cannot create their own accounts. To grant a new team member access to GameFabric:

1. Navigate to **Access Management > Users/Groups**
2. Under the **Groups** section, click **Edit** on the group you want to add the user to
3. In the group edit modal, click the **Users** tab
4. Enter the user's email address
5. Click **Add User**, then **Save**

The user can now sign in using Google SSO (or your configured SSO provider) with that email address.

::: tip Group organization
Consider creating groups based on roles (e.g., "Developers", "QA", "Operations") to simplify permission management. Each group can have different roles assigned, controlling what actions members can perform.
:::

### User permissions

The permissions a user has are determined by:

1. The [**groups**](/multiplayer-servers/authentication/editing-permissions#group) they belong to
2. The [**roles**](/multiplayer-servers/authentication/editing-permissions#role) assigned to those groups
3. The **permissions** defined in those roles

For detailed information on configuring permissions, see [Editing Permissions](/multiplayer-servers/authentication/editing-permissions).

### Removing user access

To revoke a user's access to GameFabric:

1. Navigate to **Access Management > Users/Groups**
2. Under the **Users** tab, click **Edit** on the user
3. Remove all group assignments
4. Click **Save**

Alternatively, edit each group individually and remove the user from the **Users** tab.

::: warning Complete offboarding
For proper offboarding, ensure the user is removed from all groups. Users not assigned to any group cannot sign in. A user who is off-boarded from the organization's SSO provider is also automatically excluded from accessing GameFabric.
:::
