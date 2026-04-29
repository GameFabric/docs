# API usage examples

This section provides examples of how to use the GameFabric REST API.

::: tip API Documentation
For a comprehensive overview of the API structure and available endpoints, see the [API Guide](/multiplayer-servers/api/guide).
:::

## Prerequisites

* Follow the steps described in the [Service Accounts](/multiplayer-servers/authentication/service-accounts) section to create a Service Account and fetch a token that gives you access to the REST API.
* Follow [the guide to push an image](/multiplayer-servers/getting-started/pushing-container-images) of your game server into the registry.
* Understand the [hosting models](/multiplayer-servers/architecture/identifying-your-hosting-model) to know whether to use Vessels or Armadas.

## Listing your images

Before creating a Vessel, you need to know the name of the image object you want to use.
You can list all images in a specific branch using the REST API.

```bash
curl -X 'GET' \
     "https://${GAMEFABRIC_URL}/api/container/v1/images/scopes/${BRANCH}" \
     -H 'Accept: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}"
```

Take note of the Image object name, since that is what you need to reference in the Vessel specification for the next step.

## Promoting an image to another branch

Image promotion allows you to move a container image from one branch to another (for example, from `dev` to `prod`) after it has been tested. This is a two-step process: first, you find the internal name of the image you want to promote, then you create an `ImagePromotion` resource targeting the destination branch.

### Step 1: Find the image's internal name

Use the `fieldSelector` query parameter to filter images by their image name and tag. This returns the internal object name you need for the promotion request.

```bash
curl -X 'GET' \
     "https://${GAMEFABRIC_URL}/api/container/v1/images/scopes/${SOURCE_BRANCH}?fieldSelector=spec.image=${IMAGE_NAME},spec.tag=${IMAGE_TAG}" \
     -H 'Accept: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}" | jq '.items[].metadata.name'
```

This returns the internal name of the image (for example, `simple-game-server-cwgpftt`). You need this value for the next step.

### Step 2: Create the ImagePromotion

Create an `ImagePromotion` resource in the target branch, referencing the source branch and the internal image name from step 1.

```bash
curl -X 'POST' \
     "https://${GAMEFABRIC_URL}/api/container/v1/imagepromotions/scopes/${TARGET_BRANCH}" \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -d '{
  "apiVersion": "container/v1",
  "kind": "ImagePromotion",
  "metadata": {
    "name": "'"$(uuidgen)"'",
    "branch": "'"${TARGET_BRANCH}"'"
  },
  "spec": {
    "branch": "'"${SOURCE_BRANCH}"'",
    "imageName": "'"${INTERNAL_IMAGE_NAME}"'"
  }
}'
```

| Variable | Description |
|----------|-------------|
| `SOURCE_BRANCH` | The branch the image currently exists in (for example, `dev`) |
| `TARGET_BRANCH` | The branch to promote the image to (for example, `prod`) |
| `IMAGE_NAME` | The human-readable image name (for example, `simple-game-server`) |
| `IMAGE_TAG` | The tag of the image (for example, `0.39`) |
| `INTERNAL_IMAGE_NAME` | The internal object name returned from step 1 |

::: tip
See the API reference for [listing images](/api/multiplayer-servers/apiserver#tag/container.v1.Image/operation/listImage) and [creating image promotions](/api/multiplayer-servers/apiserver#tag/container.v1.ImagePromotion/operation/createImagePromotion) for full details on available fields and responses.
:::

## Creating a Vessel

In this first example, let's create a Vessel using the REST API.

Make sure to edit the JSON payload to include your region, branch and image names, as well as replacing the game server arguments to fit your server.

You may also add as many containers as you wish, if you want to [run sidecars](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/) alongside your game server.

Take note that the `apiVersion` mentioned in the payload is the same as the resource in the URL, in this case `formation/v1beta1`.
The `kind` however is `Vessel`, the singular form of the resource from the URL, `vessels`.
It is mandatory to specify the `kind` and `apiVersion` fields in the payload.

```bash
curl -X 'POST' \
     "https://${GAMEFABRIC_URL}/api/formation/v1/environments/${ENV}/vessels" \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -d '{
  "apiVersion":"formation/v1beta1",
  "kind":"Vessel",
  "metadata":{
    "name":"myVessel",
    "environment":"<your-environment>"
  },
  "spec":{
    "description":"A vessel created by following the API documentation",
    "region":"<your-region>",
    "template":{
      "spec":{
        "containers":[
          {
            "name":"gameserver",
            "branch":"<your-branch>",
            "image":"<your-image-name>",
            "ports":[
              {
                "name":"game",
                "policy":"Passthrough",
                "containerPort":3333,
                "protocol":"UDP"
              },
              {
                "name":"allocator",
                "policy":"Dynamic",
                "containerPort":8080,
                "protocol":"TCP"
              }
            ],
            "args":[
              "/home/gameserver/server",
              "--config=/home/gameserver/config.json",
              "--log-level=debug"
            ],
            "resources":{
              "requests":{
                "cpu":"102m",
                "memory":"8Mi"
              }
            }
          }
        ]
      }
    }
  }
}'
```

## Listing Vessels

Now that you created a Vessel, you might want to use the API to list Vessels in order to know whether yours was scheduled successfully.

```bash
curl -X 'GET' \
     "https://${GAMEFABRIC_URL}/api/formation/v1/environments/${ENV}/vessels" \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -H 'Accept: application/json'
```

## Tailing a Vessel's logs

Once you confirmed that your Vessel has been scheduled successfully, you might want to read its logs.
This can be done using the REST API too.

```bash
curl -X 'GET' \
     "https://${GAMEFABRIC_URL}/api/formation/v1/environments/${ENV}/vessels/${VESSEL_NAME}/logs?follow=true" \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -H 'Connection: keep-alive'
```

## Deleting a Vessel

Finally, once you are done with your test, you may want to stop your game server.
You can do so by deleting the Vessel using the REST API.

```bash
curl -X 'DELETE' \
     "https://${GAMEFABRIC_URL}/api/formation/v1/environments/${ENV}/vessels/${VESSEL_NAME}" \
     -H "Authorization: Bearer ${GF_API_TOKEN}"
```

This results in your Vessel switching to the Terminating status, and eventually disappearing once the termination process is complete.

### Deleting a Vessel that is part of a Formation

Vessels that are part of a Formation are managed by that Formation. To remove such a Vessel, remove it from the Formation's `vessels` list using a JSON Patch request.

::: tip Identifying Controlled Resources
A Vessel or Armada controlled by a Formation or ArmadaSet has an `ownerReferences` entry in its metadata pointing to the controlling resource.
:::

First, retrieve the Formation to find the index of the Vessel you want to remove:

```bash
curl -X 'GET' \
     "https://${GAMEFABRIC_URL}/api/formation/v1/environments/${ENV}/formations/${FORMATION_NAME}" \
     -H 'Accept: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}"
```

Then remove the Vessel by its index in the `vessels` array. Replace `0` with the correct index:

```bash
curl -X 'PATCH' \
     "https://${GAMEFABRIC_URL}/api/formation/v1/environments/${ENV}/formations/${FORMATION_NAME}" \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json-patch+json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -d '[{ "op": "remove", "path": "/spec/vessels/0" }]'
```

## Creating a Region

In this example, let's create a Region with the `Distributed` scheduling strategy using the REST API.

::: tip Scheduling Strategy
The `scheduling` field controls how game servers are distributed across nodes.
See [Scheduling Strategy](/multiplayer-servers/api/scheduling-strategy) for details. This feature is currently only available via the API.
:::

```bash
curl -X 'POST' \
     "https://${GAMEFABRIC_URL}/api/core/v1/environments/${ENV}/regions" \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -d '{
  "apiVersion": "core/v1",
  "kind": "Region",
  "metadata": {
    "name": "eu-west",
    "environment": "${ENV}"
  },
  "spec": {
    "displayName": "EU West",
    "description": "European West region",
    "types": [
      {
        "name": "default",
        "locations": ["${LOCATION}"],
        "template": {
          "scheduling": "Distributed"
        }
      }
    ]
  }
}'
```

The `scheduling` field accepts either `Packed` (default) or `Distributed` as its value.
