---
title: "Step 4: Push your image"
description: "Create a branch in the GameFabric Container Registry and push your game server container image to it."
---

# Step 4: Push your image

**Goal:** create a branch in the GameFabric registry and push your container image to it.

**Before you start:** you need the service account from step 2 and the container image from
step 3.

GameFabric hosts its own container registry, the GameFabric Container Registry. Images live on **branches**, which are release tracks
such as production and development. A game server always runs a specific image from a specific
branch.

## Create a branch

Go to **Branches** in the GameFabric UI. If you have no branches yet, you have two options.

**Add default branches** creates `production` and `development` with sensible image retention
policies. This is the quickest start, and you can rename them and change their policies later.

**Create branch** lets you name the branch and define its retention policy yourself. Branch names
may contain lowercase letters, digits, hyphens and periods, must begin and end with a letter or
digit, and must be at most 63 characters.

::: info Image retention policies
A retention policy controls how long images are kept and how many tags survive. With **Keep Days**
set to 14 and **Keep Count** set to 10, images older than 14 days are deleted, but deletion stops
before it would leave fewer than 10 images. At least one of the two must be greater than zero.
:::

Before the branch is created, the UI shows the registry URL to push to. Note it down. You can find
it again later on the branch details page, reached with **View Images**.

## Log in to the registry

Use the service account credentials from step 2. Personal SSO credentials do not work here.

```bash
docker login -u ${USERNAME} -p ${PASSWORD} ${URL}
```

If the login fails, check that the service account exists and belongs to a group with push
permission, such as `default:image-providers`.

## Tag and push

Tag the image against the registry URL, including the branch name, then push it:

```bash
docker tag gameserver:v1.0.0       ${URL}/${BRANCH}/gameserver:v1.0.0
docker push --platform linux/amd64 ${URL}/${BRANCH}/gameserver:v1.0.0
```

::: warning Tags are immutable
Once pushed, a tag cannot be overwritten. Pushing the same `image:tag` again fails, and the
registry rejects `:latest` outright. Give every build a unique tag, such as `v1.0.1`,
`build-1234`, or a commit SHA. Immutable tags mean a deployment referring to a tag always gets
exactly the same bytes.
:::

## Confirm it arrived

Open the branch details page in the UI. Your image and tag are listed there.

For image retention policy details, branch editing and the full push workflow, see
[Pushing container images](/multiplayer-servers/container-images/pushing-container-images).

## What you should have now

- A branch in the GameFabric registry.
- Your image visible on that branch in the UI, ready to deploy.

Next: [Set up your environment](/multiplayer-servers/get-started/set-up-your-environment).
