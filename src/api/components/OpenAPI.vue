<template>
<div id="redocly" class="vp-raw">
  <div v-if="!ready" class="loading"/>
  <div ref="container"></div>
</div>
</template>

<script setup lang="ts">
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { HashRouter } from "react-router";
import {
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
} from "vue";

const props = defineProps(['specUrl'])

let redoc: typeof import('redoc') | undefined = undefined;

const container = ref(null);
let reactRoot: Root | undefined = undefined;

// observer callback to control loading state once the docs are hydrated.
let observer = null
let menuObserver: MutationObserver | null = null
const ready = ref(false)
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    // docs have been rendered
    if (mutation.type === 'childList') {
        ready.value = true;

      observer.disconnect(); // no longer needed
    }
  }
};

const init = () => {
  // reset initial state
  ready.value = false;
  if (observer) { observer?.disconnect(); }


  // hydrate placeholder div with redoc using react
  const reactComponent = React.createElement(HashRouter, null,
    React.createElement(redoc.RedocStandalone, {
      specUrl: props.specUrl,
      options: {
        hideLoading: true,
        disableTelemetry: true,
        scrollYOffset: 64 // navbar height
      },
    })
  );

  if (reactRoot) {
    reactRoot.render(reactComponent)
  } else {
    if (container.value) {
      reactRoot = createRoot(container.value);
      reactRoot.render(reactComponent);
    }
  }

  // observers the doc hydration to control the loading state
  observer = new MutationObserver(callback);
  observer.observe(container.value, { childList: true });

  // expand the first section ("+ Show") once rendered, unless a deep link is open
  menuObserver?.disconnect();
  if (window.location.hash) return;
  menuObserver = new MutationObserver(() => {
    const button = [...container.value?.querySelectorAll('button') ?? []]
      .find((b) => b.textContent?.trim().startsWith('+ '));
    if (!button) return;
    menuObserver.disconnect();
    button.click();
  });
  menuObserver.observe(container.value, { childList: true, subtree: true });
}

onMounted(async () => {
  redoc = await import('redoc')

  init();
});

onBeforeUnmount(() => {
  observer.disconnect()
})
onUnmounted(() => {
  reactRoot?.unmount();

  observer.disconnect()
  menuObserver?.disconnect()
});

</script>

<style scoped>
.dark, :deep(tbody > tr > td > div ) {
    background:var(--vp-c-bg) !important;
}
#redocly {
  background-color: #fff;
  height: 100%;
}

.dark #redocly {
  background: var(--vp-c-bg);
}

.loading {
  position: fixed;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 80px;
}

.loading:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.dark .loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 80px;
  height: 80px;
  margin-top: -0.5em;

  border: 8px solid white;
  border-radius: 100%;
  border-bottom-color: transparent;
  -webkit-animation: spinner 1s linear 0s infinite;
  animation: spinner 1s linear 0s infinite;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 80px;
  height: 80px;
  margin-top: -0.5em;

  border: 8px solid #6E5300;
  border-radius: 100%;
  border-bottom-color: transparent;
  -webkit-animation: spinner 1s linear 0s infinite;
  animation: spinner 1s linear 0s infinite;
}


/* Animation */

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}


</style>
