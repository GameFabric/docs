---
title: "Deploying a new build"
description: "Roll a new game server image out to a running Vessel, Formation, Armada or ArmadaSet, and roll it back if it goes wrong."
---

# Deploying a new build

Tags in the GameFabric Container Registry are immutable, so a new build is always a new tag. Getting
it running means pointing a deployment at that tag, either by hand or automatically.

## What happens when you change the image

Changing the image is a spec change, and a game server cannot swap its image while running. So
GameFabric replaces the servers rather than modifying them:

1. A new revision of the deployment is recorded.
2. Running game servers receive a shutdown hint with the reason `SpecChange`.
3. Each server has until its termination grace period expires to finish and exit.
4. Replacement servers start from the new image.

Two things follow from this. First, your game server must handle shutdown hints, or a deployment
will cut matches short. Second, a rollout is not instant — it proceeds as servers become free.

::: warning Allocated servers are not replaced immediately
An allocated game server keeps running its old image until the session ends and it shuts down. A
rollout therefore takes as long as your longest session, and both versions serve players in the
meantime. Plan for your old and new builds being live at the same time.
:::

## Update the image by hand

This is the default, and what you want for production.

1. Push the new build to a branch with a new tag. See
   [Pushing container images](/multiplayer-servers/container-images/pushing-container-images).
2. Open the Vessel, Formation, Armada or ArmadaSet, and go to **Settings**.
3. In **Container Template & Volume**, select the new tag on the container image.
4. Save.

For a Formation, change the image once on the Formation and every Vessel in it picks it up. For an
ArmadaSet, change it once and every Armada it manages picks it up.

## Update the image automatically

Enabling `autoUpdate` on a container image creates an image updater, which watches a branch and an
image name, and updates the deployment whenever a new tag is pushed. A push to that branch becomes a
rollout with nothing else to do.

That is convenient on a development environment, where you want the newest build running without
clicking through the UI. It is a poor fit for production, where you want to choose when a build goes
out, and to a known audience.

The image updater reports its state and the time of the last update it applied, so you can tell
whether it is working and what it last did.

## Watch the rollout

Armadas, ArmadaSets and Formations show a **Revision History** card, which reports how many replicas
are running the latest revision against the total. That number reaching 100% is what "the rollout is
done" means.

Individual game servers move through the normal states as they are replaced. See
[Vessel states](/multiplayer-servers/deploy/vessel-states).

## Roll back

Every revision stays in the history, so a rollback is selecting an earlier one rather than finding
and redeploying an old tag.

Revision history exists on Formations, Armadas and ArmadaSets. A standalone Vessel has none — to
return it to an earlier build, edit it and select the old tag, which is another reason to group
persistent servers into a [Formation](/multiplayer-servers/deploy/formations).

1. Open the Revision History card on the deployment.
2. Find the revision you want to return to.
3. Select **Rollback**.

Rolling back creates a *new* revision holding the state of the one you chose. The history is
therefore append-only: rolling back is itself a deployment, and can itself be rolled back.

::: info Rolling back an ArmadaSet
Rollback is performed on the child Armada, not on the ArmadaSet. Open the Armada in the region you
want to roll back and use its revision history.
:::

Two things make a rollback possible, and both need to be true before you need one:

- **The old tag still exists.** Image retention policies delete old tags. If your policy is
  aggressive, the build you want to return to may be gone. See
  [Editing a branch](/multiplayer-servers/container-images/editing-a-branch).
- **`autoUpdate` is off.** With it on, the next push to the branch rolls forward again and undoes
  your rollback.

## Where to go next

- [Container configuration](/multiplayer-servers/deploy/container-configuration) — the image and
  termination grace period settings.
- [Terminating game servers](/multiplayer-servers/deploy/terminating-game-servers) — how shutdown
  hints work and what your server must do with them.
- [Production requirements](/multiplayer-servers/operate/production-requirements) — the pre-launch
  checklist.
