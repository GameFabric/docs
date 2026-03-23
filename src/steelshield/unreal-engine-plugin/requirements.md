# Required Components

::: tip Setup Guide
For step-by-step instructions on setting up these components, see the [Getting Started](/steelshield/unreal-engine-plugin/getting-started) guide.
:::

## Supported Versions

The following versions of Unreal Engine are officially supported for the SteelShield Unreal Engine plugin and have been tested to function correctly when deployed via GameFabric:

- UE 4.25-Plus
- UE 4.27.2
- UE 5.2.1
- UE 5.5.3
- UE 5.6.1

If the version of the engine you use is not listed above, you can often use the closest matching patch version for your major and minor engine version (for example, 5.2.x for 5.2.3).
Before using an unlisted version in production, run extensive end-to-end tests in GameFabric with Proof of Identity enabled and confirm that SteelShield handles all network traffic correctly.

## Unreal Engine Patch

It is required to apply a patch to Unreal Engine which modifies the files needed to prepend the *SteelShield Token*
to the network packets on the *game client* and then remove the *SteelShield Token* on the *game server*.

Once the patch file has been applied, the engine must be recompiled.

## Unreal Engine Plugin

The plugin is the used by the *game client* directly, and is responsible for setting up standard settings for the plugin
such as game name, version, product key etc.

It is also where the integrator chooses and sets up the Token Provider for use by SteelShield.

::: tip Token Provider
Learn more about token providers and how to configure them in the [Token Provider](/steelshield/unreal-engine-plugin/tokenprovider) guide.
:::
