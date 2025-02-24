BUILD_DOC_DOCKER_IMAGE ?= gamefabric-docs-dev
DOCKER_RUN_DOC_PORT := 5173
DOCKER_RUN_DOC_MOUNT := -v $(CURDIR)/docs:/docs/docs
DOCKER_RUN_DOC_OPTS := --name gf-docs --rm $(DOCKER_RUN_DOC_MOUNT) -it

image:
	docker build -t $(BUILD_DOC_DOCKER_IMAGE) -f .dev/Dockerfile $(CURDIR)/
.PHONY: image

dev: image
	docker run $(DOCKER_RUN_DOC_OPTS) -p 5173:$(DOCKER_RUN_DOC_PORT) $(BUILD_DOC_DOCKER_IMAGE)
.PHONY: serve
