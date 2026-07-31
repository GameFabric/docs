---
title: "Step 2: Get access"
description: "Sign in to GameFabric with SSO and create the service account your CI pipeline uses to push images."
---

# Step 2: Get access

**Goal:** sign in to GameFabric, and create the service account your tooling uses to push images.

**Before you start:** you need your organization's GameFabric URL.

You need two kinds of access, and they are not interchangeable. People sign in through single
sign-on (SSO). Automation authenticates as a service account. Registry pushes and API calls only
accept service account credentials, so you need both even if you are working alone.

## Sign in

GameFabric uses SSO for user authentication. Google SSO is enabled by default, and your
organization may have added others.

1. Go to your organization's GameFabric URL.
2. Choose the sign-in button for your identity provider, such as **Log in with Google**.
3. Complete the sign-in with your provider.

::: warning 403 Forbidden after signing in
Your account exists but belongs to no group, so it has no permissions. An administrator has to add
your email address to a group before you can do anything. See
[Getting access](/multiplayer-servers/administration/getting-access).
:::

## Check you have the permissions this track needs

Permissions come from the groups you belong to and the roles assigned to those groups. To complete
the track you need to be able to create branches, environments, regions and vessels, and to manage
service accounts.

If you are the first person from your studio in GameFabric, you already have an administrator
group. If not, ask an administrator to confirm your group grants those permissions. See
[Permissions](/multiplayer-servers/administration/permissions) for how roles are defined.

## Create a service account

A service account is a non-human identity with its own username and password. You use it in step 4
to log in to the GameFabric Container Registry, and later for API calls and CI pipelines.

1. Go to **Access Management > Users/Groups**.
2. In the **Service Accounts** panel, select **Create Service Account**.
3. Enter a username, such as `ci-push`, and confirm.
4. Copy the generated password immediately. It is shown once and cannot be retrieved later.

If you lose the password, use **Regenerate Password** on the service account to issue a new one.

## Grant the service account push permission

A new service account has no permissions. To let it push container images, add it to the
`default:image-providers` group.

1. Still under **Access Management > Users/Groups**, edit the `default:image-providers` group.
2. Add the full identifier of your new service account.
3. Save.

For screenshots of each screen, and for generating API tokens from the same account, see
[Service accounts](/multiplayer-servers/administration/service-accounts).

## What you should have now

- You can sign in to the GameFabric UI.
- You have a service account username and password stored somewhere safe, such as your CI secret
  store or a password manager.
- That service account is a member of `default:image-providers`.

Next: [Prepare your game server](/multiplayer-servers/get-started/prepare-your-game-server).
