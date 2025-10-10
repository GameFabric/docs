# Required Components

::: tip Setup Guide
For step-by-step instructions on setting up these components, see the [Getting Started](/steelshield/unreal-engine-plugin/getting-started) guide.
:::

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
