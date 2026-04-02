# Pushing container images

In this section, you will learn how to make a container image available to GameFabric for subsequent deployment.

::: tip Workflow

This guide is part of the container workflow:

1. [Build your container image](/multiplayer-servers/getting-started/building-a-container-image)
2. **Push it to the registry** (this guide)
3. [Run your game server](/multiplayer-servers/getting-started/running-your-game-server)
:::

## Prerequisites

In order to follow this guide, make sure you have the following:

* User credentials to access your GameFabric UI and environment of choice
* A [Service Account](/multiplayer-servers/authentication/service-accounts) with push permissions for the GameFabric Container Registry. Personal SSO or login credentials do not work for registry authentication — you must create a dedicated Service Account and assign it to a group with push permissions (e.g., `default:image-providers`)
* A [container image of your game server binary](/multiplayer-servers/getting-started/building-a-container-image)

Log into the GameFabric UI before proceeding.

## Create a branch

If you do not already have a branch in which to push images, you need to create one.
In case you haven't already done so, there are two options available to you:

* **Add default Branches**: This will create two branches, "Production" and "Development", with default Image Retention Policies. Don't worry - you can always change the display names and policies later. See how to [edit a branch](edit-a-branch).
* **Create Branch**: This will allow you to create a custom branch with a name and an Image Retention Policy of your choice.

When creating a custom branch, please adhere to the following naming conventions:

* Names may only contain lowercase letters (a–z), digits (0–9), hyphens (-), and periods (.).
* Names must begin and end with a lowercase letter or digit.
* Hyphens may not appear at the beginning or end of a segment.
* Periods (.) separate segments; each segment must follow the same rules.
* Empty segments (e.g., consecutive periods like ..) are not allowed.
* The total length must not exceed 63 characters.

::: warning Image Retention Policy
The Image Retention Policy defines how long images are stored in the registry and how many tags are retained.
The default settings for the **Production** branch are 30 days and 10 tags. **Development** and **Custom** branches have default settings of **14 days** and **10 tags**. _These default settings can be adjusted for any branch._

For example, with **Keep Days** set to 14 and **Keep Count** set to 10, images older than 14 days will be deleted, but the process stops if removing an image would leave fewer than 10 images.

_Note: Either **Keep Days** or **Keep Count** (or both) must be >0. Setting **Keep Days** or **Keep Count** to _0_ means that specific rule will be ignored._
:::

### Add default branches

::: info
This option is only available if you have not created any branches yet.
:::

1. Navigate to the **Branches** section in the GameFabric UI.
![GUI_branches_empty_overview.png](images/branches/GUI_branches_empty_overview.png)
2. Click the **Add Default Branches** button.
3. A confirmation pop-up will appear. Click **Create** to confirm or **Cancel** to abort.
![GUI_branches_add_default.png](images/branches/GUI_branches_add_default.png)
4. The default branches are created. You can now see them in the branches overview.
![GUI_branches_created_default.png](images/branches/GUI_branches_created_default.png)

### Create custom branch

You can also create custom branches with a name and an Image Retention Policy of your choice.

1. Click the **Create Branch** button in the branches overview.
2. A new window will open, allowing you to create a custom branch.
![GUI_branches_create.png](images/branches/GUI_branches_create.png)
3. Give it a name that makes it easy for other users to identify its purpose, then click the **Next** button.
4. Create the Image Retention Policy. You can define a policy by the **Image Retention Policy Name**, an **Image Regex**, a **Tag Regex**, as well as **Keep Count** and **Keep Days**. You can also add multiple policies through the **+ Add** Button, or remove policies through the **Remove** Button.
![GUI_branches_create_policy.png](images/branches/GUI_branches_create_policy.png)
5. (Optional) If you don't wish to define an Image Retention Policy, you can toggle the switch - **but please be aware that this is not recommended**.
![GUI_branches_create_no_policies.png](images/branches/GUI_branches_create_no_policies.png)
6. Before creating your branch, the UI shows you the URL at which you will be able to push Docker images, to make them a part of this branch. **Make note of that URL, as you will need it in the next step.**
![GUI_branches_create_summary.png](images/branches/GUI_branches_create_summary.png)
7. Click the **Create Branch** button to finish the process. The newly created branch will now be visible in the branches overview.
![GUI_branches_created.png](images/branches/GUI_branches_created.png)
Once the branch is created, you can find that URL again by clicking the **View Images** button in the row for your branch. This leads you to the branch details page, which displays the relevant URL at the top of the interface, in the blue information box.
![GUI_branches_see_url.png](images/branches/GUI_branches_see_url.png)

## Push the game server image

::: tip Service Account credentials required
The `${USERNAME}` and `${PASSWORD}` in the command below are your **Service Account** credentials, not your personal login or SSO credentials. If you have not created a Service Account yet, follow the [Service Accounts guide](/multiplayer-servers/authentication/service-accounts).
:::

Log in to the GameFabric Container Registry:

```bash
docker login -u ${USERNAME} -p ${PASSWORD} $URL
```

::: info
If you encounter issues with your credentials:

1. Verify that your Service Account exists
1. Confirm that it belongs to a group with push permissions (e.g., `default:image-providers`). See [Service Accounts](/multiplayer-servers/authentication/service-accounts) for details
1. If the problem persists, reach out via the [GameFabric Help Center](/multiplayer-servers/getting-started/glossary#gamefabric-help-center) or contact your Customer Success Manager
:::

Once you are logged in, tag your image against the registry, and push it.
Do not forget to include the branch name after the registry URL.

```bash
docker tag gameserver:v1.0.0       ${URL}/${BRANCH}/gameserver:v1.0.0
docker push --platform linux/amd64 ${URL}/${BRANCH}/gameserver:v1.0.0
```

::: warning Immutable tags
Once you push an image tag, you cannot overwrite it. Pushing the same `image:tag` combination again fails.

Immutable tags ensure that a given tag always refers to the exact same image content:

- **Reproducibility** — Deployments using a specific tag always use identical content.
- **Security** — Prevents accidental or malicious overwrites of production images.
- **Auditability** — Provides a clear history of what was deployed and when.

Use unique tags for each build:

- Semantic versioning: `gameserver:v1.0.0`, `gameserver:v1.0.1`
- Build identifiers: `gameserver:build-1234`, `gameserver:abc123def`
- Timestamps: `gameserver:dev-20260224-143052`

The registry rejects the `:latest` tag.

To deploy new image versions automatically, enable [autoUpdate](/multiplayer-servers/getting-started/running-your-game-server#image) in your Vessel or Armada configuration. The system watches for new tags matching a pattern and triggers rollouts when they appear.
:::

You should now see the game image listed in the branch detail view.

::: info
We currently can not guarantee that all features work with `podman` due to an open bug related to a [non standard behaviour](https://github.com/containers/podman/issues/15187).
With that being said we support the full feature set of docker CLI and test its functionality with each release.
:::

![GUI_Branches_Details.png](images/armada/GUI_Branches_Details.png)

This means you can now select that image when creating an Armada.
