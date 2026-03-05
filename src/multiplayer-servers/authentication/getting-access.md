# Getting Access

## Overview

GameFabric uses SSO (Single Sign-On) for user authentication and RBAC (Role-Based Access Control) for permissions.

- Google SSO is enabled by default
- Users must be added to a Group by an admin before they can sign in
- Access permissions are determined by Group membership

## For users

### Prerequisites

Before you can sign in to GameFabric:

- You need your organization's GameFabric URL (provided during onboarding)
- An administrator must add your email to at least one Group

### Signing in with Google

1. Navigate to your organization's GameFabric URL
2. Click **Log in with Google**
3. Sign in with your Google account

::: warning 403 Forbidden error
If you see a 403 Forbidden error after signing in, your account has not been added to any Group. Contact your administrator to request access.
:::

### Email login

The **Log in with Email** option is for Service Accounts only, which are used for programmatic API access. See [Service Accounts](/multiplayer-servers/authentication/service-accounts) for more information.

### Custom SSO providers

If your organization uses a different identity provider (Microsoft ENTRA, Okta, Auth0, etc.), your administrator may have configured a custom SSO option. The login page displays additional sign-in buttons for any configured providers.

For information on configuring custom SSO providers, see [Setup Third-Party OAuth Integration](setup-third-party-oauth.md).

## For administrators

### Adding a new User

Users cannot create their own accounts. To grant a new team member access to GameFabric:

1. Navigate to **Access Management > Users/Groups**
2. Under the **Groups** section, click **Edit** on the Group you want to add the User to
3. In the Group edit modal, click the **Users** tab
4. Enter the User's email address
5. Click **Add User**, then **Save**

The User can now sign in using Google SSO (or your configured SSO provider) with that email address.

::: tip Group organization
Consider creating Groups based on Roles (e.g., "Developers", "QA", "Operations") to simplify permission management. Each Group can have different Roles assigned, controlling what actions members can perform.
:::

### User permissions

The permissions a User has are determined by:

1. The [**Groups**](editing-permissions.md#group) they belong to
2. The [**Roles**](editing-permissions.md#role) assigned to those Groups
3. The **permissions** defined in those Roles

For detailed information on configuring permissions, see [Editing Permissions](editing-permissions.md).

### Removing User access

To revoke a User's access to GameFabric:

1. Navigate to **Access Management > Users/Groups**
2. Under the **Users** tab, click **Edit** on the User
3. Remove all Group assignments
4. Click **Save**

Alternatively, edit each Group individually and remove the User from the **Users** tab.

::: warning Complete offboarding
For proper offboarding, ensure the User is removed from all Groups. Users not assigned to any Group cannot sign in.
:::
