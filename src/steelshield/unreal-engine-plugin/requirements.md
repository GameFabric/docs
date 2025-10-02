# Required Components

## Unreal Engine Patch

It is required to apply a patch to Unreal Engine which modifies the files needed to prepend the *SteelShield Token*
to the network packets on the *game client* and then remove the *SteelShield Token* on the *game server*.

Once the patch file has been applied, the engine must be recompiled.

## Unreal Engine Plugin

The plugin is the used by the *game client* directly, and is responsible for setting up standard settings for the plugin
such as game name, version, product key etc.

It is also where the integrator chooses and sets up the Token Provider for use by SteelShield
