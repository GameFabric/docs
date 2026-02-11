# API Usage Examples

This section provides examples of how to use the GameFabric REST API.

::: tip API Documentation
For a comprehensive overview of the API structure and available endpoints, see the [API Guide](/multiplayer-servers/api/guide).
:::

## Prerequisites

* Follow the steps described in the [API Authentication](../authentication/authentication.md) section to create a Service Account and fetch a token that gives you access to the REST API.
* Follow [the guide to push an image](../getting-started/pushing-container-images.md) of your game server into the registry.
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

## Creating a Vessel

In this first example, let's create a Vessel using the REST API.

Make sure to edit the JSON payload to include your region, branch and image names, as well as replacing the game server arguments to fit your server.

You may also add as many containers as you wish, if you want to [run sidecars](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/) alongside your game server.

Take note that the `apiVersion` mentioned in the payload is the same as the resource in the URL, in this case `formation/v1beta1`.
The `kind` however is `Vessel`, the singular form of the resource from the URL, `vessels`.
It is mandatory to specify the `kind` and `apiVersion` fields in the payload.

```bash
curl -X 'POST' \
     "https://${GAMEFABRIC_URL}/api/formation/v1beta1/environments/${ENV}/vessels" \
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
     "https://${GAMEFABRIC_URL}/api/formation/v1beta1/environments/${ENV}/vessels" \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -H 'Accept: application/json'
```

## Tailing a Vessel's logs

Once you confirmed that your Vessel has been scheduled successfully, you might want to read its logs.
This can be done using the REST API too.

```bash
curl -X 'GET' \
     "https://${GAMEFABRIC_URL}/api/formation/v1beta1/environments/${ENV}/vessels/${VESSSEL_NAME}/logs?follow=true" \
     -H "Authorization: Bearer ${GF_API_TOKEN}" \
     -H 'Connection: keep-alive'
```

## Deleting a Vessel

Finally, once you are done with your test, you may want to stop your game server.
You can do so by deleting the Vessel using the REST API.

```bash
curl -X 'DELETE' \
     "https://${GAMEFABRIC_URL}/api/formation/v1beta1/environments/${ENV}/vessels/${VESSSEL_NAME}" \
     -H "Authorization: Bearer ${GF_API_TOKEN}"
```

This results in your Vessel switching to the Terminating status, and eventually disappearing once the termination process is complete.
