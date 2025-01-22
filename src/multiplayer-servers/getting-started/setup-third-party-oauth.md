# What is it?
GameFabric excels at seperating concepts and concerns in order to provide our Users flexibility, security and sustainability.

One of those concepts is Authentication.

GameFabric allows our Users to plug their own Authentication Provider in, to carry out their own Authentication Flow externally, without GameFabric knowing or having access to sensitive Authentication data.

# Pre-requisites
- An existing GameFabric Installation and access to it via the default user
- An OIDC Provider and "ClientID", "ClientSecret" ()

# How to set up Third Party OAuth?
Delegating the Authentication Flow on GameFabric to an external provider can be accomplished via configuring a new OIDC Provider.

# OIDC Provider
OIDC (OpenID Connect) is an Identity Layer built on top of the OAuth 2.0 that enables secure User Authentication and 
Identity Information exchange between a client application, like GameFabric, and an identity provider.

# Setting up a new OIDC
- Navigate to "https://development.gamefabric.dev/ui/rbac/providers/oidc" and click "Add Provider"

![alt text](image.png)

- Enter a desired display "ID" and display "Name" for your new Provider

![alt text](image-1.png)

- On the second step, configure the "Issuer" you'd like to use, and the "Client ID" and "Client Secret" that was provided to you via this issuer.

![alt text](image-2.png)

- Third step is for configuring which claims will be requested with given scopes

![alt text](image-3.png)

- Claim configurations

    - "Scopes" textbox can be used for requesting additional scopes from the OIDC to GameFabric

    Here are some common "scopes":

    ![alt text](image-5.png)

    - "UserID Key" can be used for configuring which claim from the OIDC Provider will be mapped to the "User ID" on GameFabric. Default value is "sub" unless configured otherwise.

    - "UserName Key" can be used for configuring which calim from the OIDC Provider will be mapped to the "UserName" on GameFabric. Default value is "name" unless configured otherwise.

    - Prompts
    "Prompt" textbox can be used for forwarding this to the OIDC Provider, which in effect will configure the behaviour of the authentication prompt. Default value is "consent" unless configured otherwise.

    Prompts are specific instructions or parameters that control how the authentication process behaves, particularly when interacting with users. They are part of the authorization request sent from a client application to the identity provider.

    Prompts are defined in the prompt parameter of the OAuth 2.0/OpenID Connect authentication request. They specify how the identity provider should handle user interaction during authentication.

    Here are some "prompt" options:

    ![alt text](image-4.png)

- Claim Mapping

It's possible for some OIDC Providers to return non-standard claims. "Claim Mapping" section can be used for mapping these non-standard claims to more "standardized" GameFabric claims.

- Provider Discovery Override

When a custom OIDC Provider is configured, GameFabric sends an initial "discovery pre-flight" to the provider, which in turn provider returns with necessary information required for carrying out the authentication.

This section allows overriding the "Token URL", "Auth URL" and "JWKs URL" that is returned from the discovery endpoint of the provider.