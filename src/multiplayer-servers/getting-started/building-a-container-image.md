# Building a Container Image

The purpose of this guide is to explain how to package game server binaries as Docker images.
This document will help you if you do not already have a Docker image for your game server,
and you are not yet accustomed to using Docker.

::: info Container vs. Docker
Docker is a popular set of tools to interact with standardized container technologies. Therefore, terms like
"Docker Image" and "Container Image" are used interchangeably in this document, as they are in publicly
available documentation.
:::

## Purpose of a Docker image

Docker images are meant to be run as containers, where your binary and all of its dependencies and configuration run
together as a single unit. It can run on any machine or OS that is capable of running Docker in a consistent way, which
makes it easy to deploy anywhere across baremetal and cloud clusters alike.

## Pre-requisites

### Install Docker on your machine

Depending on your operating system, please follow the correct guide as described below.
Once your installation is successful you should be able to run `docker run hello-world` to make sure Docker functions as expected.

#### Linux

Follow the steps described in the [official Docker Engine installation guide](https://docs.docker.com/engine/install/).
Make sure to also follow the [Post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/) for UNIX systems,
in order to be able to use Docker commands without `sudo`.

#### Windows

It is required for either WSL2 or the Hyper-V and Container Windows features to be enabled on your machine.
Once that is done, follow the official [Docker for Windows install guide](https://docs.docker.com/desktop/install/windows-install/).

#### MacOS

Visit the [official Docker for Mac install guide](https://docs.docker.com/desktop/install/mac-install/) and make sure
to select whether your computer uses an intel chip or an Apple Silicon chip, as some of the steps may vary.

### Build a Linux-compatible game server binary

In order to run your game server in Docker, it needs to be compiled for `linux/amd64`.

## Create a Dockerfile

Now, the most important step is to package your binary into a Docker image using what is called a Dockerfile.

A Dockerfile is a text document that contains the commands a user could call on a command line to assemble an image.
For example, this typically includes fetching dependencies required to run the binary, configuring the environment, settings permissions
on certain folders or just copying and moving files.

::: warning Container User
Container users are currently restricted to using `uid` 1000, as shown in the example below. See [Quotas](../multiplayer-services/quotas.md#container-user-id) for more details.
:::

Here is an example, where this Dockerfile builds an image that runs the game server:

```Dockerfile
# 1. Select an operating system.
FROM ubuntu:22.04

# 2. Pre-install requirements.
RUN apt-get update \
        && apt-get install -y gnupg ca-certificates \
        && apt-get clean -y

# 3. Prepare a working directory and permissions.
RUN mkdir /app
RUN useradd -m -u 1000 gameserver
RUN chown gameserver:gameserver /app

# 4. Prepare your game server binary.
USER 1000
COPY --chown=gameserver:gameserver path/to/gameserver /app/
RUN chmod +x /app/gameserver
WORKDIR /app

CMD ["/app/gameserver"]
```

1. First, select a Linux operating system, ideally a minimal one to reduce the overall image size, but
   for the sake of simplicity this example uses Ubuntu 22.04 (LTS).

2. Update the dependencies to ensure all security patches are included in the built image.
   Additionally, install anything that is required to run the game server binary.
   Keep in mind that this is a blank system, without pre-installed custom libraries.

3. Make sure the game server binary is in a separate folder within the Docker image,
   configured to be owned by a custom Linux user and group that is allowed to execute it.

4. The game server binary should already be compiled and is then copied from your machine to the Docker image when it is built.

For more information, see [the reference on how Dockerfiles are formatted](https://docs.docker.com/engine/reference/builder/)
and the various instructions that they support.

## Building the Dockerfile

Now that your Dockerfile is written, the next step is to build the image.

Run `docker build -t gameserver:v1.0.0 .` in the folder that contains your Dockerfile to create a Docker image named `gameserver`
and tagged `v1.0.0`.

You may now run this image and your game server by running `docker run gameserver:v1.0.0` in your terminal.

## Conclusion

Now that your Docker image is ready, you may proceed to make it available to GameFabric as described in
[Pushing Container Images](pushing-container-images.md).
