# Secrets
# Secrets

A `Secret` is a secure placeholder for small amounts of sensitive data such as passwords, API keys, or tokens.
Using a Secret lets you keep confidential values out of application code, container images, and most configuration files, and instead reference the Secret from the workloads that need it.

# Management & Configuration

Secrets are specific to a given environment and can be managed in the associated “Secrets” view for that environment.

![Secrets_Menu_Item.png](images/secrets/Secrets_Menu_Item.png)

## Create a Secret

To create a Secret, click on the “Add Secret” button.

![Secrets_Add_Button.png](images/secrets/Secrets_Add_Button.png)

In the “Create” view, define the name of the secret, optionally add a description for later reference, and define one or more key/value pairs.

::: warning Opaque values
The `Value` part of the Data can only be seen during the creation process.
Once saved, the value is never displayed again! Note it down securely before saving if you may need to reference it later.
:::

![Secrets_Create_View.png](images/secrets/Secrets_Create_View.png)

# Use a Secret

Secrets can be used for ArmadaSets, Armadas, Formations, and Vessels.
They can be either provided as an environment variable or mounted to a specific path.

## As an Environment Variable

To setup a secret as an environment variable for a game server, open the Armada(Set) or Formation/Vessel dashboard, and navigate to `Settings > Containers > Environment Variables`.

Create a new environment variable of type `Secret`, and select which `Secret` & `Key` should be associated with the variable.

![Secrets_Environment_Variable_Setup_Step1.png](images/secrets/Secrets_Environment_Variable_Setup_Step1.png)

::: info Multiple key/value pairs
If a secret contains multiple key/value pairs, each one must be exposed as an individual environment variable.

![Secrets_Environment_Variable_Setup_Step2.png](images/secrets/Secrets_Environment_Variable_Setup_Step2.png)
:::

## Mount as files

To mount a secret into a game server’s filesystem, open the Armada(Set) or Formation/Vessel dashboard and go to `Settings > Containers > Secrets`.

1. Select the `Secret`.
2. Enter the **absolute path** where it should be mounted.

![Secrets_Mount_Setup.png](images/secrets/Secrets_Mount_Setup.png)

The secret is mounted as a directory.
Each key/value pair is written as a separate file:

* the file name is the key
* the file contents are the value
