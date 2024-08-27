<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useData, useRouter } from 'vitepress'
import { watch } from 'vue'

const { page } = useData()
const { go } = useRouter()


const redirects = Object.entries({
  '/api-specs/': '/api/multiplayer-servers/',
})

watch(
    () => page.value.isNotFound,
    (isNotFound) => {
      if (!isNotFound || !inBrowser) return


      // ignore valid 404s
      if (['/steelshield/', '/multiplayer-servers/', '/api/'].some((path) => window.location.pathname.startsWith(path))) {
        return;
      }


      const redirect = redirects.find(([from]) => window.location.pathname.startsWith(from))
      if(!redirect) {
        // fallback to the default (we migrated from / to /multiplayer-servers initially). If there is no match we will have a valid 404
        go(`multiplayer-servers${window.location.pathname}`)
        return;
      }

      // handle valid redirect
      go(redirect[1] + window.location.pathname.slice(redirect[0].length))
    },
    { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
