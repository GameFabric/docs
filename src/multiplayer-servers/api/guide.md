# GF API Guide

This document describes the various APIs that are compose the GameFabric API.

## Object Structure

Almost all API objects follow the same structure:

* Metadata (`ObjectMeta`): Contains the object's name, namespace, creation and update timestamps and other such fields. When creating an object, you must specify the `name`, `apiVersion` and `kind` fields, as well as `environment` for environment-scoped endpoints.
* Specification (`Spec`): The object's specification, which you can modify to change the object's behavior.
* Status (`Status`): The object's status, which is **read only** and contains information about the object's current state. Usually this describes whether the state is currently synchronized with the defined specification.

## Requests

You may use either `Content-Type: application/json` or `Content-Type: application/yaml` in your requests, as the API supports both formats.

Most API endpoints also allow you to specify `follow=true` to watch objects for changes.

## APIs

### Armada

The Armada API contains all resources related to Armadas. It allows CRUD operations on ArmadaSets, Armadas and their related resources.

### Container

This API is used by image-related resources, such as Branches, Images and ImageUpdaters.

The ImageUpdater is a bit special, as you must create it alongside your Armadas and Vessels if you want their container images to be updated automatically.
This is done by using the `POST /api/container/v1/environments/{env}/imageupdaters` endpoint and referencing the object you created in the `targetRef` field.

### Billing

The Billing API allows you to retrieve invoices for your account.

### Core

The Core API contains all resources related to the GameFabric itself, and those that are used by both the Formation and Armada objects.

### Formation

The Formation API contains all resources related to Formations and Vessels.

### Armada

The Armada API contains all resources related to ArmadaSets and Armadas.

### RBAC

The RBAC API is used to manage groups, roles and role bindings.

## External Resources

* [REST API Basics](https://www.redhat.com/en/topics/api/what-is-a-rest-api)
* [HTTP Methods](https://restfulapi.net/http-methods/)
