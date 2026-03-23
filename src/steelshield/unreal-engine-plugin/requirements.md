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

If the version of the engine you use is not listed above, it is often possible to apply the closest matching patch version to your engine and the plugin should work fine, however extensive testing should be done within GameFabric with Proof of Identity enabled, to ensure that the network traffic is handled by SteelShield correctly.

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
